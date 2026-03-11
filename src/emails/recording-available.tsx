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
  recordingUrl: string;
};

export function RecordingAvailableEmail({ eventTitle, recordingUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Recording available: {eventTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Recording available</Heading>
          <Section style={section}>
            <Text style={text}>
              The recording for <strong>{eventTitle}</strong> is now available.
            </Text>
            <Text style={text}>
              <Link href={recordingUrl} style={link}>
                Watch recording
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
