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
  oldStartsAt: string;
  newStartsAt: string;
  durationMinutes: number;
  meetLink?: string;
};

export function RescheduleEmail({
  eventTitle,
  oldStartsAt,
  newStartsAt,
  durationMinutes,
  meetLink,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Rescheduled: {eventTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Event rescheduled</Heading>
          <Section style={section}>
            <Text style={text}>
              <strong>{eventTitle}</strong> has been rescheduled.
            </Text>
            <Text style={text}>
              <strong>Old time:</strong> {oldStartsAt}
            </Text>
            <Text style={text}>
              <strong>New time:</strong> {newStartsAt} ({durationMinutes} minutes)
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
