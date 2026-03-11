import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteAcceptButton } from "./invite-accept-button";
import Link from "next/link";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const session = await auth();

  const invite = await db.invite.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invite) notFound();

  if (invite.expiresAt < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invite expired</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This invite to join {invite.organization.name} has expired. Ask
              your team admin to send a new invite.
            </p>
            <Link
              href="/en/login"
              className="mt-4 inline-block text-sm text-primary underline"
            >
              Sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session?.user) {
    const loginUrl = `/en/login?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`;
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>You&apos;re invited!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You&apos;ve been invited to join{" "}
              <strong>{invite.organization.name}</strong> on HubStream. Sign in
              with the email this invite was sent to ({invite.email}) to accept.
            </p>
            <Link href={loginUrl}>
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userEmail = (session.user as { email?: string | null }).email;
  if (!userEmail || userEmail.toLowerCase() !== invite.email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Wrong account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This invite was sent to {invite.email}. Sign in with that email to
              accept this invite.
            </p>
            <Link
              href={`/api/auth/signout?callbackUrl=${encodeURIComponent("/en/login")}`}
              className="mt-4 inline-block text-sm text-primary underline"
            >
              Sign out and use different account
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Accept invite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Join <strong>{invite.organization.name}</strong> on HubStream as a{" "}
            {invite.role}?
          </p>
          <InviteAcceptButton token={token} />
        </CardContent>
      </Card>
    </div>
  );
}
