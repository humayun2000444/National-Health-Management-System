import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET hospital settings
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email! },
      include: {
        hospital: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const hospital = admin.hospital;

    // Parse settings JSON
    const settings = hospital.settings as Record<string, boolean> | null;

    return NextResponse.json({
      id: hospital.id,
      name: hospital.name,
      slug: hospital.slug,
      logo: hospital.logo,
      email: hospital.email,
      phone: hospital.phone,
      address: hospital.address,
      website: hospital.website,
      primaryColor: hospital.primaryColor,
      secondaryColor: hospital.secondaryColor,
      accentColor: hospital.accentColor,
      subscription: hospital.subscription,
      settings: settings || {
        onlineBooking: true,
        prescriptions: true,
        medicalRecords: true,
        smsNotifications: false,
        emailNotifications: true,
        appointmentReminder: 24,
        replyToEmail: "",
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update hospital settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email! },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      website,
      primaryColor,
      secondaryColor,
      accentColor,
      settings,
    } = body;

    // Build update data - only include fields that are provided
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (website !== undefined) updateData.website = website;
    if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
    if (secondaryColor !== undefined) updateData.secondaryColor = secondaryColor;
    if (accentColor !== undefined) updateData.accentColor = accentColor;
    if (settings !== undefined) updateData.settings = settings;

    const hospital = await prisma.hospital.update({
      where: { id: admin.hospitalId },
      data: updateData,
    });

    return NextResponse.json({
      id: hospital.id,
      name: hospital.name,
      slug: hospital.slug,
      logo: hospital.logo,
      email: hospital.email,
      phone: hospital.phone,
      address: hospital.address,
      website: hospital.website,
      primaryColor: hospital.primaryColor,
      secondaryColor: hospital.secondaryColor,
      accentColor: hospital.accentColor,
      subscription: hospital.subscription,
      settings: hospital.settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
