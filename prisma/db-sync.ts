/**
 * Database Auto-Sync Script
 *
 * This script automatically:
 * 1. Syncs the database schema (creates missing tables)
 * 2. Seeds essential data (hospital, admin) if not present
 *
 * Run this script on project startup to ensure database is ready
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { execSync } from "child_process";

const prisma = new PrismaClient();

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function syncDatabase() {
  log("\n========================================", "cyan");
  log("  NHMS Database Auto-Sync", "cyan");
  log("========================================\n", "cyan");

  // Step 1: Sync database schema using Prisma
  log("[1/3] Syncing database schema...", "blue");

  try {
    execSync("npx prisma db push --skip-generate", {
      stdio: "inherit",
      env: { ...process.env },
    });
    log("✓ Database schema synchronized successfully\n", "green");
  } catch (error) {
    log("✗ Failed to sync database schema", "red");
    log("  Make sure your DATABASE_URL is correct in .env file", "yellow");
    throw error;
  }

  // Step 2: Generate Prisma client if needed
  log("[2/3] Ensuring Prisma client is up to date...", "blue");

  try {
    execSync("npx prisma generate", {
      stdio: "inherit",
      env: { ...process.env },
    });
    log("✓ Prisma client is ready\n", "green");
  } catch (error) {
    log("✗ Failed to generate Prisma client", "red");
    throw error;
  }

  // Step 3: Seed essential data if not present
  log("[3/3] Checking essential data...", "blue");
  await seedEssentialData();

  log("\n========================================", "green");
  log("  Database Ready!", "green");
  log("========================================\n", "green");
}

async function seedEssentialData() {
  try {
    // Check if hospital exists
    let hospital = await prisma.hospital.findFirst();

    if (!hospital) {
      log("  → Creating default hospital...", "yellow");
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
      log("  ✓ Hospital created: " + hospital.name, "green");
    } else {
      log("  ✓ Hospital exists: " + hospital.name, "green");
    }

    // Check if admin exists
    const adminExists = await prisma.admin.findFirst({
      where: { hospitalId: hospital.id },
    });

    if (!adminExists) {
      log("  → Creating admin account...", "yellow");
      const adminPassword = await hash("admin123", 12);

      const admin = await prisma.admin.create({
        data: {
          name: "System Administrator",
          email: "admin@hospital.com",
          password: adminPassword,
          phone: "+880 1234-567891",
          role: "admin",
          hospitalId: hospital.id,
        },
      });
      log("  ✓ Admin created: " + admin.email, "green");
      log("\n  ╔════════════════════════════════════════╗", "yellow");
      log("  ║  DEFAULT ADMIN CREDENTIALS             ║", "yellow");
      log("  ║  Email: admin@hospital.com             ║", "yellow");
      log("  ║  Password: admin123                    ║", "yellow");
      log("  ║  Please change password after login!   ║", "yellow");
      log("  ╚════════════════════════════════════════╝", "yellow");
    } else {
      log("  ✓ Admin account exists", "green");
    }

    // Check if at least one department exists
    const departmentCount = await prisma.department.count({
      where: { hospitalId: hospital.id },
    });

    if (departmentCount === 0) {
      log("  → Creating default departments...", "yellow");

      const departments = [
        { name: "General Medicine", description: "Primary healthcare and general consultations", icon: "stethoscope" },
        { name: "Cardiology", description: "Heart and cardiovascular care", icon: "heart" },
        { name: "Neurology", description: "Brain and nervous system care", icon: "brain" },
        { name: "Orthopedics", description: "Bone and joint care", icon: "bone" },
        { name: "Pediatrics", description: "Child and infant healthcare", icon: "baby" },
        { name: "Ophthalmology", description: "Eye care and vision treatments", icon: "eye" },
        { name: "Dermatology", description: "Skin conditions and treatments", icon: "hand" },
        { name: "ENT", description: "Ear, nose, and throat care", icon: "ear" },
      ];

      for (const dept of departments) {
        await prisma.department.create({
          data: {
            ...dept,
            hospitalId: hospital.id,
          },
        });
      }
      log("  ✓ Created " + departments.length + " departments", "green");
    } else {
      log("  ✓ Departments exist: " + departmentCount + " found", "green");
    }

    // Check if demo doctor exists (optional - for testing)
    const doctorExists = await prisma.doctor.findFirst({
      where: { email: "doctor@hospital.com" },
    });

    if (!doctorExists) {
      log("  → Creating demo doctor account...", "yellow");
      const doctorPassword = await hash("doctor123", 12);

      // Get first department for the doctor
      const firstDept = await prisma.department.findFirst({
        where: { hospitalId: hospital.id },
      });

      const doctor = await prisma.doctor.create({
        data: {
          name: "Dr. Sarah Wilson",
          email: "doctor@hospital.com",
          password: doctorPassword,
          phone: "+880 1234-567892",
          specialization: "General Medicine",
          qualification: "MBBS, MD",
          experience: 10,
          bio: "Experienced physician dedicated to patient care.",
          consultationFee: 500,
          hospitalId: hospital.id,
          departmentId: firstDept?.id || null,
          availableDays: JSON.stringify(["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"]),
          startTime: "09:00",
          endTime: "17:00",
        },
      });
      log("  ✓ Demo doctor created: " + doctor.email, "green");
    } else {
      log("  ✓ Demo doctor exists", "green");
    }

    // Check if demo patient exists (optional - for testing)
    const patientExists = await prisma.patient.findFirst({
      where: { email: "patient@hospital.com" },
    });

    if (!patientExists) {
      log("  → Creating demo patient account...", "yellow");
      const patientPassword = await hash("patient123", 12);

      const patient = await prisma.patient.create({
        data: {
          name: "Rahim Ahmed",
          email: "patient@hospital.com",
          password: patientPassword,
          phone: "+880 1234-567893",
          dateOfBirth: new Date("1985-06-15"),
          gender: "Male",
          bloodGroup: "A+",
          address: "456 Health Street, Dhaka, Bangladesh",
          emergencyContact: "Fatima Ahmed",
          emergencyPhone: "+880 1234-567894",
          hospitalId: hospital.id,
        },
      });
      log("  ✓ Demo patient created: " + patient.email, "green");
    } else {
      log("  ✓ Demo patient exists", "green");
    }

    log("\n  ──────────────────────────────────────", "cyan");
    log("  Test Credentials (if newly created):", "cyan");
    log("  ──────────────────────────────────────", "cyan");
    log("  Admin:   admin@hospital.com / admin123", "cyan");
    log("  Doctor:  doctor@hospital.com / doctor123", "cyan");
    log("  Patient: patient@hospital.com / patient123", "cyan");
    log("  ──────────────────────────────────────\n", "cyan");

  } catch (error) {
    log("  ✗ Error seeding data: " + (error as Error).message, "red");
    throw error;
  }
}

// Run the sync
syncDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
