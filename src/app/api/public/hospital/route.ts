/**
 * Public Hospital Information API
 *
 * Returns public hospital information including logo, name, and contact details.
 * This endpoint does not require authentication.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface HospitalSettings {
  showHospitalName?: boolean;
  showTagline?: boolean;
  tagline?: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const hospital = await prisma.hospital.findFirst({
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        email: true,
        phone: true,
        address: true,
        website: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        settings: true,
      },
    });

    if (!hospital) {
      return NextResponse.json(
        {
          name: "City General Hospital",
          slug: "city-general-hospital",
          logo: null,
          email: "info@cityhospital.com",
          phone: "+880 1234-567890",
          address: "123 Healthcare Avenue, Dhaka, Bangladesh",
          primaryColor: "#0d9488",
          secondaryColor: "#059669",
          accentColor: "#f59e0b",
          showHospitalName: true,
          showTagline: true,
          tagline: "Caring for You & Your Family",
        },
        { status: 200 }
      );
    }

    // Extract display settings from settings JSON
    const settings = hospital.settings as HospitalSettings | null;

    return NextResponse.json({
      ...hospital,
      showHospitalName: settings?.showHospitalName ?? true,
      showTagline: settings?.showTagline ?? true,
      tagline: settings?.tagline ?? "Caring for You & Your Family",
    });
  } catch (error) {
    console.error("Error fetching hospital info:", error);
    return NextResponse.json(
      { error: "Failed to fetch hospital information" },
      { status: 500 }
    );
  }
}
