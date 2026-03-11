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
  eventTitle: string;
  startsAt: string;
  durationMinutes: number;
  meetLink?: string;
  cancelUrl: string;
  unsubscribeUrl: string;
  hoursUntil: number;
};

export function ReminderEmail({
  eventTitle,
  startsAt,
  durationMinutes,
  meetLink,
  cancelUrl,
  unsubscribeUrl,
  hoursUntil,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reminder: {eventTitle} starts in {String(hoursUntil)}h</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reminder: {eventTitle}</Heading>
          <Section style={section}>
            <Text style={text}>
              Your webinar starts in {hoursUntil} hour{hoursUntil !== 1 ? "s" : ""}.
            </Text>
            <Text style={text}>
              <strong>When:</strong> {startsAt} ({durationMinutes} minutes)
            </Text>
            {meetLink && (
              <Text style={text}>
                <strong>Join:</strong>{" "}
                <Link href={meetLink} style={link}>
                  {meetLink}
                </Link>
              </Text>
            )}
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              <Link href={cancelUrl} style={link}>
                Cancel my registration
              </Link>
              {" · "}
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe from reminders
              </Link>
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

const link = {
  color: "#2754C5",
  textDecoration: "underline",
};

const footer = {
  marginTop: "32px",
  padding: "0 40px",
};

const footerText = {
  fontSize: "12px",
  color: "#8898aa",
};
