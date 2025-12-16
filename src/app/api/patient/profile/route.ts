import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET - Fetch patient profile
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        bloodGroup: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        allergies: true,
        chronicConditions: true,
        createdAt: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...patient,
      dateOfBirth: patient.dateOfBirth
        ? patient.dateOfBirth.toISOString().split("T")[0]
        : null,
    });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update patient profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { email: session.user.email! },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      emergencyPhone,
      allergies,
      chronicConditions,
    } = body;

    // Update patient profile
    const updatedPatient = await prisma.patient.update({
      where: { id: patient.id },
      data: {
        name: name || patient.name,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        address: address || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        allergies: allergies || null,
        chronicConditions: chronicConditions || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        bloodGroup: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        allergies: true,
        chronicConditions: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      patient: {
        ...updatedPatient,
        dateOfBirth: updatedPatient.dateOfBirth
          ? updatedPatient.dateOfBirth.toISOString().split("T")[0]
          : null,
      },
    });
  } catch (error) {
    console.error("Error updating patient profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// PATCH - Update password
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { email: session.user.email! },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      patient.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Validate new password
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.patient.update({
      where: { id: patient.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
