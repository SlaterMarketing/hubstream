const HUBSPOT_API = "https://api.hubapi.com";

export async function getHubSpotTokens(orgId: string) {
  const { db } = await import("@/lib/db");
  const settings = await db.integrationSettings.findUnique({
    where: { orgId },
  });
  return settings
    ? {
        accessToken: settings.hubspotAccessToken,
        refreshToken: settings.hubspotRefreshToken,
        expiresAt: settings.hubspotExpiresAt,
      }
    : null;
}

async function refreshHubSpotToken(
  orgId: string,
  refreshToken: string
): Promise<{ accessToken: string; expiresAt: number } | null> {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://api.hubapi.com/oauth/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;

  const { db } = await import("@/lib/db");
  await db.integrationSettings.update({
    where: { orgId },
    data: {
      hubspotAccessToken: data.access_token,
      hubspotExpiresAt: expiresAt,
    },
  });

  return { accessToken: data.access_token, expiresAt };
}

export async function getValidHubSpotAccessToken(
  orgId: string
): Promise<string | null> {
  const tokens = await getHubSpotTokens(orgId);
  if (!tokens?.accessToken || !tokens.refreshToken) return null;

  const now = Math.floor(Date.now() / 1000);
  const buffer = 60;
  if (tokens.expiresAt && tokens.expiresAt > now + buffer) {
    return tokens.accessToken;
  }

  const refreshed = await refreshHubSpotToken(orgId, tokens.refreshToken);
  return refreshed?.accessToken ?? null;
}

const DEFAULT_FIELD_MAPPING: Record<string, string> = {
  firstName: "firstname",
  lastName: "lastname",
  company: "company",
  jobTitle: "jobtitle",
};

/** Convert field key to HubSpot property internal name (lowercase, underscores) */
function toHubSpotPropertyName(key: string): string {
  return key
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function getHubSpotPropertyName(
  formKey: string,
  customMapping?: Record<string, string> | null
): string {
  const mapping = { ...DEFAULT_FIELD_MAPPING, ...customMapping };
  return mapping[formKey] ?? toHubSpotPropertyName(formKey);
}

export async function createOrUpdateHubSpotContact(
  accessToken: string,
  data: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    customProperties?: Record<string, string | boolean>;
  },
  fieldMapping?: Record<string, string> | null
): Promise<string | null> {
  const searchRes = await fetch(
    `${HUBSPOT_API}/crm/v3/objects/contacts/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: data.email,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!searchRes.ok) return null;
  const searchData = (await searchRes.json()) as { results: { id: string }[] };

  const properties: Record<string, string> = {
    email: data.email,
  };

  // Standard fields using mapping
  const standardData = {
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company,
    jobTitle: data.jobTitle,
  };
  for (const [key, value] of Object.entries(standardData)) {
    if (value) {
      properties[getHubSpotPropertyName(key, fieldMapping)] = value;
    }
  }

  // Custom fields using mapping (or auto-convert as fallback)
  for (const [key, value] of Object.entries(data.customProperties ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      const propName = getHubSpotPropertyName(key, fieldMapping);
      if (propName) {
        properties[propName] = typeof value === "boolean" ? String(value) : String(value);
      }
    }
  }

  if (searchData.results?.length) {
    const contactId = searchData.results[0].id;
    const updateRes = await fetch(
      `${HUBSPOT_API}/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      }
    );
    return updateRes.ok ? contactId : null;
  }

  const createRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (!createRes.ok) return null;
  const createData = (await createRes.json()) as { id: string };
  return createData.id;
}

export async function createHubSpotMeeting(
  accessToken: string,
  contactId: string,
  data: {
    title: string;
    startTime: Date;
    endTime: Date;
    body?: string;
    location?: string;
  }
): Promise<string | null> {
  const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        hs_timestamp: data.startTime.getTime(),
        hs_meeting_title: data.title,
        hs_meeting_start_time: data.startTime.getTime(),
        hs_meeting_end_time: data.endTime.getTime(),
        hs_meeting_body: data.body ?? "",
        hs_meeting_location: data.location ?? "",
        hs_meeting_outcome: "SCHEDULED",
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 200 }],
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const result = (await res.json()) as { id: string };
  return result.id;
}
