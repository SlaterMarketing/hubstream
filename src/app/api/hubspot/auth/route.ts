import { NextResponse } from "next/server";
import { auth } from "@/auth";

const HUBSPOT_SCOPES = [
  "oauth",
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
].join(" ");

export async function GET(req: Request) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL));
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "HubSpot is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "en";

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/hubspot/callback`;
  const state = `${user.orgId}|${locale}`;

  const url = new URL("https://app.hubspot.com/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", HUBSPOT_SCOPES);
  url.searchParams.set("state", state);

  return NextResponse.redirect(url.toString());
}
