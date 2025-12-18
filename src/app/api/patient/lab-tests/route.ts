import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List patient's lab tests
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patientId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const labTests = await prisma.labTest.findMany({
      where: {
        patientId,
        ...(status && status !== "all" && { status }),
      },
      include: {
        orderedBy: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get stats
    const stats = await prisma.labTest.groupBy({
      by: ["status"],
      where: { patientId },
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
    console.error("Patient lab tests list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab tests" },
      { status: 500 }
    );
  }
}
