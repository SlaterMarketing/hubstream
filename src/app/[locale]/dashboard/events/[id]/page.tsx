import type { JSONContent } from "@tiptap/core";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EventPageEditor } from "@/components/event-page-editor/event-page-editor";
import { EventActions } from "@/components/event-form";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { EmbedCodeSnippet } from "@/components/embed-code-snippet";
import { ExportCsvButton } from "./export-csv-button";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user as { orgId?: string | null };

  if (!user?.orgId) return null;

  const event = await db.event.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      _count: { select: { registrations: true } },
      organization: { select: { slug: true } },
      registrations: {
        where: { status: "confirmed" },
        orderBy: { createdAt: "desc" },
      },
      eventSpeakers: {
        include: { speaker: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!event) notFound();

  const orgSlug = event.organization.slug;
  const eventPath = `/${orgSlug}/${event.slug}`;
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://hubstream.app";
  const eventUrl = `${baseUrl}/${locale}${eventPath}`;
  const embedUrl = `${baseUrl}/embed/${event.id}`;

  return (
    <div className="space-y-8">
      {/* Compact bar: status, analytics, actions - title lives in WYSIWYG hero */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {event.status} • {event._count.registrations} registrations
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/events/${id}/analytics`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent"
          >
            Analytics
          </Link>
          <EventActions
            event={{
              id: event.id,
              status: event.status,
              meetLink: event.meetLink,
            }}
          />
        </div>
      </div>

      {event.status !== "cancelled" && (
        <EventPageEditor
          event={{
            id: event.id,
            status: event.status,
            title: event.title,
            subtitle: event.subtitle,
            description: event.description as JSONContent | null | undefined,
            startsAt: event.startsAt,
            durationMinutes: event.durationMinutes,
            timezone: event.timezone,
            coverImageUrl: event.coverImageUrl,
            media: event.media as Array<{ type: "image" | "youtube"; url?: string; videoId?: string }> | null,
            registrationFields: event.registrationFields as Array<{ key: string; label: string; type: "text" | "select" | "checkbox"; required?: boolean; options?: string[] }> | null,
            eventSpeakers: event.eventSpeakers.map((es) => ({
              speakerId: es.speakerId,
              speaker: es.speaker,
            })),
          }}
          mode="edit"
        />
      )}

      {(event.status === "published" || event.status === "completed") && (
        <Card>
          <CardHeader>
            <CardTitle>Public event page</CardTitle>
            <CardDescription>
              Share this link with attendees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={eventPath} className="text-primary hover:underline break-all block">
              {eventUrl}
            </Link>
            <EmbedCodeSnippet embedUrl={embedUrl} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registrations</CardTitle>
            <CardDescription>
              {event.registrations.length} confirmed registrant
              {event.registrations.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          {event.registrations.length > 0 && (
            <ExportCsvButton eventId={event.id} />
          )}
        </CardHeader>
        <CardContent>
          {event.registrations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registrations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.registrations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>
                      {[r.firstName, r.lastName].filter(Boolean).join(" ") || "—"}
                    </TableCell>
                    <TableCell>{r.company ?? "—"}</TableCell>
                    <TableCell>{r.jobTitle ?? "—"}</TableCell>
                    <TableCell>
                      {r.createdAt.toLocaleDateString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {event.status === "completed" && event.recordingUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={event.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Watch recording
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
