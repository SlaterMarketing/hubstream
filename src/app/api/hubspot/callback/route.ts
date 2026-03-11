import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const parts = (state ?? "").split("|");
  const orgId = parts[0] || (state ?? "");
  const locale = parts[1] || "en";
  const returnTo = parts[2] || "";
  const settingsPath = `/${locale}/dashboard/settings`;
  const onboardingPath = `/${locale}/onboarding?step=integrations&hubspot=connected`;

  const errorPath = returnTo === "onboarding"
    ? `/${locale}/onboarding?step=integrations&hubspot=error&message=${encodeURIComponent(error || "")}`
    : `${settingsPath}?hubspot=error&message=${encodeURIComponent(error || "")}`;

  if (error) {
    return NextResponse.redirect(new URL(errorPath, baseUrl));
  }

  if (!code || !state || !orgId) {
    return NextResponse.redirect(
      new URL(returnTo === "onboarding" ? `/${locale}/onboarding?step=integrations&hubspot=error` : `/en/dashboard/settings?hubspot=error`, baseUrl)
    );
  }
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const errPath = returnTo === "onboarding" ? `/${locale}/onboarding?step=integrations&hubspot=error` : `${settingsPath}?hubspot=error`;
    return NextResponse.redirect(new URL(errPath, baseUrl));
  }

  const redirectUri = `${baseUrl}/api/hubspot/callback`;

  const tokenRes = await fetch("https://api.hubapi.com/oauth/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    const errPath = returnTo === "onboarding"
      ? `/${locale}/onboarding?step=integrations&hubspot=error&message=${encodeURIComponent(err)}`
      : `${settingsPath}?hubspot=error&message=${encodeURIComponent(err)}`;
    return NextResponse.redirect(new URL(errPath, baseUrl));
  }

  const data = (await tokenRes.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;

  await db.integrationSettings.upsert({
    where: { orgId },
    create: {
      orgId,
      hubspotAccessToken: data.access_token,
      hubspotRefreshToken: data.refresh_token,
      hubspotExpiresAt: expiresAt,
    },
    update: {
      hubspotAccessToken: data.access_token,
      hubspotRefreshToken: data.refresh_token,
      hubspotExpiresAt: expiresAt,
    },
  });

  const successPath = returnTo === "onboarding" ? onboardingPath : `${settingsPath}?hubspot=connected`;
  return NextResponse.redirect(new URL(successPath, baseUrl));
}
