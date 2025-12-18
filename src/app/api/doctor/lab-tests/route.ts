import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List lab tests ordered by this doctor
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const patientId = searchParams.get("patientId");

    const labTests = await prisma.labTest.findMany({
      where: {
        orderedById: doctorId,
        ...(status && status !== "all" && { status }),
        ...(patientId && { patientId: parseInt(patientId) }),
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            gender: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get stats
    const stats = await prisma.labTest.groupBy({
      by: ["status"],
      where: { orderedById: doctorId },
      _count: true,
    });

    return NextResponse.json({
      labTests: labTests.map((test) => ({
        ...test,
        results: test.results || null,
        referenceRange: test.referenceRange || null,
      })),
      stats: stats.reduce((acc, s) => {
        acc[s.status] = s._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error("Lab tests list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab tests" },
      { status: 500 }
    );
  }
}

// POST - Order new lab test
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorId = parseInt(session.user.id);
    const hospitalId = session.user.hospitalId;
    const body = await request.json();
    const { patientId, testName, testType, priority, notes, appointmentId } = body;

    if (!patientId || !testName || !testType) {
      return NextResponse.json(
        { error: "Patient, test name, and test type are required" },
        { status: 400 }
      );
    }

    const labTest = await prisma.labTest.create({
      data: {
        patientId: parseInt(patientId),
        orderedById: doctorId,
        hospitalId,
        testName,
        testType,
        priority: priority || "routine",
        notes,
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
      },
      include: {
        patient: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Lab test ordered successfully",
      labTest,
    });
  } catch (error) {
    console.error("Create lab test error:", error);
    return NextResponse.json(
      { error: "Failed to order lab test" },
      { status: 500 }
    );
  }
}

// PUT - Update lab test (add results)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, results, referenceRange, status, notes, interpretation } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Lab test ID is required" },
        { status: 400 }
      );
    }

    const labTest = await prisma.labTest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!labTest) {
      return NextResponse.json(
        { error: "Lab test not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (results !== undefined) {
      updateData.results = results;
      updateData.resultDate = new Date();
    }
    if (referenceRange !== undefined) updateData.referenceRange = referenceRange;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (interpretation !== undefined) updateData.interpretation = interpretation;

    const updated = await prisma.labTest.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        patient: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Lab test updated successfully",
      labTest: updated,
    });
  } catch (error) {
    console.error("Update lab test error:", error);
    return NextResponse.json(
      { error: "Failed to update lab test" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel lab test
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Lab test ID is required" },
        { status: 400 }
      );
    }

    const labTest = await prisma.labTest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!labTest) {
      return NextResponse.json(
        { error: "Lab test not found" },
        { status: 404 }
      );
    }

    if (labTest.status === "completed") {
      return NextResponse.json(
        { error: "Cannot cancel completed lab test" },
        { status: 400 }
      );
    }

    await prisma.labTest.update({
      where: { id: parseInt(id) },
      data: { status: "cancelled" },
    });

    return NextResponse.json({
      message: "Lab test cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel lab test error:", error);
    return NextResponse.json(
      { error: "Failed to cancel lab test" },
      { status: 500 }
    );
  }
}
