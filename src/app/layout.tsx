import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Fetch hospital info for dynamic metadata
async function getHospitalInfo() {
  try {
    const hospital = await prisma.hospital.findFirst({
      select: {
        name: true,
        settings: true,
      },
    });
    return hospital;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const hospital = await getHospitalInfo();
  const hospitalName = hospital?.name || "City General Hospital";
  const settings = hospital?.settings as { tagline?: string } | null;
  const tagline = settings?.tagline || "Hospital Management System";

  return {
    title: {
      default: hospitalName,
      template: `%s | ${hospitalName}`,
    },
    description: `${hospitalName} - ${tagline}. Manage appointments, patients, doctors, prescriptions, and more.`,
    keywords: ["hospital", "management", "healthcare", "appointments", "doctors", "patients", "medical", hospitalName.toLowerCase()],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <BrandingProvider>
            {children}
          </BrandingProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
