import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  orgName: string;
  inviterName?: string;
  inviteUrl: string;
  expiresInDays: number;
};

export function InviteEmail({
  orgName,
  inviterName,
  inviteUrl,
  expiresInDays,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {orgName} on HubStream</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're invited!</Heading>
          <Section style={section}>
            <Text style={text}>
              {inviterName ? (
                <>
                  <strong>{inviterName}</strong> has invited you to join{" "}
                  <strong>{orgName}</strong> on HubStream.
                </>
              ) : (
                <>
                  You've been invited to join <strong>{orgName}</strong> on
                  HubStream.
                </>
              )}
            </Text>
            <Text style={text}>
              HubStream helps teams run webinars with Google Meet and HubSpot.
              Accept the invite to collaborate on events and manage registrations
              together.
            </Text>
            <Link href={inviteUrl} style={button}>
              Accept invite
            </Link>
            <Text style={smallText}>
              This invite expires in {expiresInDays} days. If you didn't expect
              this email, you can safely ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
};

const section = {
  padding: "0 40px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const button = {
  backgroundColor: "#2754C5",
  borderRadius: "6px",
  color: "#fff !important",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  margin: "16px 0",
};

const smallText = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "24px 0 0",
};
