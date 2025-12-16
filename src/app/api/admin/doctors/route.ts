import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET all doctors
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get admin's hospital
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email! },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const doctors = await prisma.doctor.findMany({
      where: { hospitalId: admin.hospitalId },
      include: {
        department: true,
        hospital: true,
        _count: {
          select: {
            appointments: true,
            prescriptions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

// POST - Create new doctor
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      specialization,
      qualification,
      experience,
      departmentId,
      consultationFee,
    } = body;

    // Check if email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: "A doctor with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get admin's hospital
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email! },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        specialization,
        qualification,
        experience: parseInt(experience) || 0,
        consultationFee: parseFloat(consultationFee) || 0,
        hospitalId: admin.hospitalId,
        departmentId: departmentId ? parseInt(departmentId) : null,
      },
      include: {
        department: true,
        hospital: true,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}

// PUT - Update doctor
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      departmentId,
      consultationFee,
      status,
    } = body;

    const updateData: Record<string, unknown> = {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience: parseInt(experience) || 0,
      consultationFee: parseFloat(consultationFee) || 0,
      departmentId: departmentId ? parseInt(departmentId) : null,
      status,
    };

    const doctor = await prisma.doctor.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        department: true,
        hospital: true,
      },
    });

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

// DELETE - Delete doctor
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    await prisma.doctor.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
