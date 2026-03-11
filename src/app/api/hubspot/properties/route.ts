import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getValidHubSpotAccessToken } from "@/lib/hubspot";

const HUBSPOT_API = "https://api.hubapi.com";

export async function GET() {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidHubSpotAccessToken(user.orgId);
  if (!accessToken) {
    return NextResponse.json(
      { error: "HubSpot not connected" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `${HUBSPOT_API}/crm/v3/properties/contacts?archived=false`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: "Failed to fetch HubSpot properties", details: err },
      { status: res.status }
    );
  }

  const data = (await res.json()) as {
    results: Array<{ name: string; label: string; hidden?: boolean }>;
  };

  const properties = data.results
    .filter((p) => !p.hidden)
    .map((p) => ({ name: p.name, label: p.label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return NextResponse.json({ properties });
}
