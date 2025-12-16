import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all departments
export async function GET() {
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

    const departments = await prisma.department.findMany({
      where: { hospitalId: admin.hospitalId },
      include: {
        _count: {
          select: {
            doctors: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// POST - Create new department
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon } = body;

    // Get admin's hospital
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email! },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Check if department already exists in this hospital
    const existingDept = await prisma.department.findFirst({
      where: {
        name,
        hospitalId: admin.hospitalId,
      },
    });

    if (existingDept) {
      return NextResponse.json(
        { error: "A department with this name already exists" },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
        description,
        icon,
        hospitalId: admin.hospitalId,
      },
      include: {
        _count: {
          select: {
            doctors: true,
          },
        },
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}

// PUT - Update department
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, icon, status } = body;

    const department = await prisma.department.update({
      where: { id },
      data: {
        name,
        description,
        icon,
        status,
      },
      include: {
        _count: {
          select: {
            doctors: true,
          },
        },
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}

// DELETE - Delete department
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
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    // Check if department has doctors
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: { doctors: true },
        },
      },
    });

    if (department?._count.doctors && department._count.doctors > 0) {
      return NextResponse.json(
        { error: "Cannot delete department with assigned doctors" },
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
