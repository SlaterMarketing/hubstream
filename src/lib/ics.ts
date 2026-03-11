export function generateIcs(data: {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  url?: string;
}): string {
  const formatDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "Z";

  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HubStream//Webinar//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@hubstream.app`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(data.start)}`,
    `DTEND:${formatDate(data.end)}`,
    `SUMMARY:${escape(data.title)}`,
    ...(data.description ? [`DESCRIPTION:${escape(data.description)}`] : []),
    ...(data.location ? [`LOCATION:${escape(data.location)}`] : []),
    ...(data.url ? [`URL:${data.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}
