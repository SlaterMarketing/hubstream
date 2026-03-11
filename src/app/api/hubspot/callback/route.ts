import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const settingsPath = "/en/dashboard/settings";

  if (error) {
    return NextResponse.redirect(
      new URL(`${settingsPath}?hubspot=error&message=${encodeURIComponent(error)}`, baseUrl)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`${settingsPath}?hubspot=error`, baseUrl)
    );
  }

  const orgId = state;
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`${settingsPath}?hubspot=error`, baseUrl)
    );
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
    return NextResponse.redirect(
      new URL(`${settingsPath}?hubspot=error&message=${encodeURIComponent(err)}`, baseUrl)
    );
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

  return NextResponse.redirect(
    new URL(`${settingsPath}?hubspot=connected`, baseUrl)
  );
}
