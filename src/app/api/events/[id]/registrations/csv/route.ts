import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const user = session?.user as { orgId?: string | null };
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await db.event.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      registrations: {
        where: { status: "confirmed" },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const headers = [
    "Email",
    "First Name",
    "Last Name",
    "Company",
    "Job Title",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Registered At",
  ];

  const rows = event.registrations.map((r) => [
    r.email,
    r.firstName ?? "",
    r.lastName ?? "",
    r.company ?? "",
    r.jobTitle ?? "",
    r.utmSource ?? "",
    r.utmMedium ?? "",
    r.utmCampaign ?? "",
    r.createdAt.toISOString(),
  ]);

  const escapeCsv = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csv =
    headers.map(escapeCsv).join(",") +
    "\n" +
    rows.map((row) => row.map(escapeCsv).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${event.slug}-registrations.csv"`,
    },
  });
}
