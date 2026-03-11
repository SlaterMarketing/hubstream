import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  eventTitle: string;
};

export function CancellationEmail({ eventTitle }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Event cancelled: {eventTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Event cancelled</Heading>
          <Section style={section}>
            <Text style={text}>
              Unfortunately, <strong>{eventTitle}</strong> has been cancelled.
            </Text>
            <Text style={text}>
              You will not need to take any action. We apologize for any inconvenience.
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
