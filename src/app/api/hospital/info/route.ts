import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userType = session.user.type;
    let hospitalId: string | null = null;

    // Get hospital ID based on user type
    if (userType === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { email: session.user.email },
        select: { hospitalId: true },
      });
      hospitalId = admin?.hospitalId || null;
    } else if (userType === "doctor") {
      const doctor = await prisma.doctor.findUnique({
        where: { email: session.user.email },
        select: { hospitalId: true },
      });
      hospitalId = doctor?.hospitalId || null;
    } else if (userType === "patient") {
      const patient = await prisma.patient.findUnique({
        where: { email: session.user.email },
        select: { hospitalId: true },
      });
      hospitalId = patient?.hospitalId || null;
    }

    if (!hospitalId) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        primaryColor: true,
        settings: true,
      },
    });

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    // Parse settings and ensure currency is included
    const settings = hospital.settings as Record<string, unknown> || {};

    return NextResponse.json({
      ...hospital,
      settings: {
        ...settings,
        currency: settings.currency || "USD",
        timezone: settings.timezone || "UTC",
        dateFormat: settings.dateFormat || "MM/DD/YYYY",
      },
    });
  } catch (error) {
    console.error("Error fetching hospital info:", error);
    return NextResponse.json(
      { error: "Failed to fetch hospital info" },
      { status: 500 }
    );
  }
}
