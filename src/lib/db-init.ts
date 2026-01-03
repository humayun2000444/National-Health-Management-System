/**
 * Database Initialization Check
 *
 * This module provides runtime database health checks and initialization
 * for production environments where the db-sync script might not run.
 */

import { prisma } from "./prisma";
import { hash } from "bcryptjs";

let isInitialized = false;

/**
 * Ensures the database has essential data (hospital, admin)
 * This runs once per application lifecycle
 */
export async function ensureDatabaseReady(): Promise<boolean> {
  if (isInitialized) {
    return true;
  }

  try {
    // Check if hospital exists
    let hospital = await prisma.hospital.findFirst();

    if (!hospital) {
      console.log("[DB-INIT] Creating default hospital...");
      hospital = await prisma.hospital.create({
        data: {
          name: "City General Hospital",
          slug: "city-general-hospital",
          email: "info@cityhospital.com",
          phone: "+880 1234-567890",
          address: "123 Healthcare Avenue, Dhanmondi, Dhaka 1205, Bangladesh",
          website: "https://cityhospital.com",
          primaryColor: "#0d9488",
          secondaryColor: "#059669",
          accentColor: "#f59e0b",
          subscription: "professional",
          settings: {
            currency: "BDT",
            timezone: "Asia/Dhaka",
            dateFormat: "DD/MM/YYYY",
            onlineBooking: true,
            prescriptions: true,
            medicalRecords: true,
            smsNotifications: false,
            emailNotifications: true,
          },
        },
      });
      console.log("[DB-INIT] Hospital created:", hospital.name);
    }

    // Check if admin exists
    const adminExists = await prisma.admin.findFirst({
      where: { hospitalId: hospital.id },
    });

    if (!adminExists) {
      console.log("[DB-INIT] Creating default admin account...");
      const adminPassword = await hash("admin123", 12);

      await prisma.admin.create({
        data: {
          name: "System Administrator",
          email: "admin@hospital.com",
          password: adminPassword,
          phone: "+880 1234-567891",
          role: "admin",
          hospitalId: hospital.id,
        },
      });
      console.log("[DB-INIT] Admin created: admin@hospital.com / admin123");
    }

    // Create default departments if none exist
    const departmentCount = await prisma.department.count({
      where: { hospitalId: hospital.id },
    });

    if (departmentCount === 0) {
      console.log("[DB-INIT] Creating default departments...");

      const departments = [
        { name: "General Medicine", description: "Primary healthcare and general consultations", icon: "stethoscope" },
        { name: "Cardiology", description: "Heart and cardiovascular care", icon: "heart" },
        { name: "Neurology", description: "Brain and nervous system care", icon: "brain" },
        { name: "Orthopedics", description: "Bone and joint care", icon: "bone" },
        { name: "Pediatrics", description: "Child and infant healthcare", icon: "baby" },
        { name: "Ophthalmology", description: "Eye care and vision treatments", icon: "eye" },
      ];

      for (const dept of departments) {
        await prisma.department.create({
          data: {
            ...dept,
            hospitalId: hospital.id,
          },
        });
      }
      console.log("[DB-INIT] Created", departments.length, "departments");
    }

    isInitialized = true;
    console.log("[DB-INIT] Database ready!");
    return true;

  } catch (error) {
    console.error("[DB-INIT] Error initializing database:", error);
    return false;
  }
}

/**
 * Simple health check to verify database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the default hospital
 */
export async function getDefaultHospital() {
  try {
    return await prisma.hospital.findFirst();
  } catch {
    return null;
  }
}
