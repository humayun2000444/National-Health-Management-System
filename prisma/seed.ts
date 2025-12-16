import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // Create Hospital
  const hospital = await prisma.hospital.upsert({
    where: { slug: "city-general-hospital" },
    update: {},
    create: {
      name: "City General Hospital",
      slug: "city-general-hospital",
      email: "info@citygeneral.com",
      phone: "+1 234 567 8900",
      address: "123 Medical Center Drive, Healthcare City, HC 12345",
      website: "https://citygeneral.com",
      primaryColor: "#2563eb",
      secondaryColor: "#1e40af",
      accentColor: "#10b981",
      subscription: "professional",
      settings: {
        onlineBooking: true,
        prescriptions: true,
        medicalRecords: true,
        smsNotifications: false,
        emailNotifications: true,
      },
    },
  });

  console.log("Hospital created:", hospital.name);

  // Create Departments
  const departments = [
    { name: "Cardiology", description: "Heart and cardiovascular system care", icon: "heart" },
    { name: "Neurology", description: "Brain and nervous system disorders", icon: "brain" },
    { name: "Orthopedics", description: "Bones, joints, and muscles treatment", icon: "bone" },
    { name: "Pediatrics", description: "Medical care for infants and children", icon: "baby" },
    { name: "Dermatology", description: "Skin conditions and treatments", icon: "eye" },
  ];

  const createdDepartments: Record<string, number> = {};

  for (const dept of departments) {
    const created = await prisma.department.upsert({
      where: {
        id: 0, // This will always create new
      },
      update: {},
      create: {
        ...dept,
        hospitalId: hospital.id,
      },
    });
    createdDepartments[dept.name] = created.id;
  }

  // Get actual department IDs
  const allDepartments = await prisma.department.findMany({
    where: { hospitalId: hospital.id },
  });

  for (const dept of allDepartments) {
    createdDepartments[dept.name] = dept.id;
  }

  console.log("Departments created:", Object.keys(createdDepartments).join(", "));

  // Create Admin
  const adminPassword = await hash("admin123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@hospital.com" },
    update: {},
    create: {
      name: "John Administrator",
      email: "admin@hospital.com",
      password: adminPassword,
      phone: "+1 234 567 8901",
      role: "admin",
      hospitalId: hospital.id,
    },
  });

  console.log("Admin created:", admin.email);

  // Create Doctors
  const doctorPassword = await hash("doctor123", 12);

  const doctorsData = [
    {
      name: "Dr. Sarah Wilson",
      email: "doctor@hospital.com",
      specialization: "Cardiology",
      qualification: "MD, FACC",
      experience: 12,
      bio: "Renowned cardiologist with over 12 years of experience in treating heart conditions.",
      consultationFee: 150,
      departmentName: "Cardiology",
      availableDays: JSON.stringify(["monday", "tuesday", "wednesday", "thursday", "friday"]),
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      name: "Dr. Michael Chen",
      email: "michael.chen@hospital.com",
      specialization: "Neurology",
      qualification: "MD, PhD",
      experience: 8,
      bio: "Expert neurologist specializing in brain disorders and stroke treatment.",
      consultationFee: 175,
      departmentName: "Neurology",
      availableDays: JSON.stringify(["monday", "wednesday", "friday"]),
      startTime: "10:00",
      endTime: "18:00",
    },
    {
      name: "Dr. James Brown",
      email: "james.brown@hospital.com",
      specialization: "Orthopedics",
      qualification: "MD, FAAOS",
      experience: 15,
      bio: "Orthopedic surgeon with expertise in sports injuries and joint replacement.",
      consultationFee: 125,
      departmentName: "Orthopedics",
      availableDays: JSON.stringify(["tuesday", "thursday", "saturday"]),
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      name: "Dr. Emily Parker",
      email: "emily.parker@hospital.com",
      specialization: "Pediatrics",
      qualification: "MD, FAAP",
      experience: 6,
      bio: "Caring pediatrician dedicated to children's health and wellness.",
      consultationFee: 100,
      departmentName: "Pediatrics",
      availableDays: JSON.stringify(["monday", "tuesday", "wednesday", "thursday", "friday"]),
      startTime: "09:00",
      endTime: "17:00",
    },
  ];

  const createdDoctors: Record<string, number> = {};

  for (const doctorData of doctorsData) {
    const { departmentName, ...data } = doctorData;
    const departmentId = createdDepartments[departmentName];

    const doctor = await prisma.doctor.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        password: doctorPassword,
        hospitalId: hospital.id,
        departmentId: departmentId || null,
      },
    });
    createdDoctors[doctor.email] = doctor.id;
  }

  console.log("Doctors created:", Object.keys(createdDoctors).length);

  // Create Patients
  const patientPassword = await hash("patient123", 12);

  const patientsData = [
    {
      name: "John Smith",
      email: "patient@hospital.com",
      phone: "+1 234 567 8910",
      dateOfBirth: new Date("1979-05-15"),
      gender: "Male",
      bloodGroup: "A+",
      address: "456 Patient Street, Healthcare City, HC 12345",
      emergencyContact: "Jane Smith",
      emergencyPhone: "+1 234 567 8911",
      allergies: "Penicillin",
      chronicConditions: "Hypertension",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 234 567 8912",
      dateOfBirth: new Date("1992-08-22"),
      gender: "Female",
      bloodGroup: "B+",
      address: "789 Health Ave, Healthcare City, HC 12345",
      emergencyContact: "Robert Davis",
      emergencyPhone: "+1 234 567 8913",
      allergies: "None",
      chronicConditions: "Diabetes Type 2",
    },
    {
      name: "Robert Johnson",
      email: "robert.johnson@email.com",
      phone: "+1 234 567 8914",
      dateOfBirth: new Date("1966-03-10"),
      gender: "Male",
      bloodGroup: "O-",
      address: "321 Wellness Blvd, Healthcare City, HC 12345",
      emergencyContact: "Mary Johnson",
      emergencyPhone: "+1 234 567 8915",
      allergies: "Sulfa drugs",
      chronicConditions: "Heart Arrhythmia",
    },
  ];

  const createdPatients: Record<string, number> = {};

  for (const patientData of patientsData) {
    const patient = await prisma.patient.upsert({
      where: { email: patientData.email },
      update: {},
      create: {
        ...patientData,
        password: patientPassword,
        hospitalId: hospital.id,
      },
    });
    createdPatients[patient.email] = patient.id;
  }

  console.log("Patients created:", Object.keys(createdPatients).length);

  // Create Appointments
  const appointmentsData = [
    {
      patientEmail: "patient@hospital.com",
      doctorEmail: "doctor@hospital.com",
      departmentName: "Cardiology",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      startTime: "09:00",
      endTime: "09:30",
      status: "confirmed",
      type: "consultation",
      symptoms: "Chest pain and shortness of breath",
    },
    {
      patientEmail: "emily.davis@email.com",
      doctorEmail: "michael.chen@hospital.com",
      departmentName: "Neurology",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      startTime: "10:00",
      endTime: "10:30",
      status: "pending",
      type: "consultation",
      symptoms: "Recurring headaches",
    },
    {
      patientEmail: "robert.johnson@email.com",
      doctorEmail: "doctor@hospital.com",
      departmentName: "Cardiology",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      startTime: "11:00",
      endTime: "11:30",
      status: "confirmed",
      type: "followup",
      symptoms: "Follow-up for heart condition",
    },
  ];

  // Get all doctors and patients for ID lookup
  const allDoctors = await prisma.doctor.findMany({ where: { hospitalId: hospital.id } });
  const allPatients = await prisma.patient.findMany({ where: { hospitalId: hospital.id } });

  const doctorIdMap: Record<string, number> = {};
  const patientIdMap: Record<string, number> = {};

  for (const d of allDoctors) {
    doctorIdMap[d.email] = d.id;
  }
  for (const p of allPatients) {
    patientIdMap[p.email] = p.id;
  }

  for (const aptData of appointmentsData) {
    const { patientEmail, doctorEmail, departmentName, ...data } = aptData;

    await prisma.appointment.create({
      data: {
        ...data,
        patientId: patientIdMap[patientEmail],
        doctorId: doctorIdMap[doctorEmail],
        departmentId: createdDepartments[departmentName],
        hospitalId: hospital.id,
      },
    });
  }

  console.log("Appointments created:", appointmentsData.length);

  // Create Prescriptions
  const prescriptionsData = [
    {
      patientEmail: "patient@hospital.com",
      doctorEmail: "doctor@hospital.com",
      diagnosis: "Hypertension",
      medications: JSON.stringify([
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
        { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "30 days" },
      ]),
      instructions: "Take with food. Avoid alcohol. Monitor blood pressure daily.",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      patientEmail: "emily.davis@email.com",
      doctorEmail: "michael.chen@hospital.com",
      diagnosis: "Migraine",
      medications: JSON.stringify([
        { name: "Sumatriptan", dosage: "50mg", frequency: "As needed", duration: "PRN" },
      ]),
      instructions: "Take at onset of migraine. Do not exceed 2 tablets per day.",
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const rxData of prescriptionsData) {
    const { patientEmail, doctorEmail, ...data } = rxData;

    await prisma.prescription.create({
      data: {
        ...data,
        patientId: patientIdMap[patientEmail],
        doctorId: doctorIdMap[doctorEmail],
      },
    });
  }

  console.log("Prescriptions created:", prescriptionsData.length);

  // Create Medical Records
  const recordsData = [
    {
      patientEmail: "patient@hospital.com",
      doctorEmail: "doctor@hospital.com",
      type: "diagnosis",
      title: "Hypertension Diagnosis",
      description: "Patient diagnosed with Stage 1 hypertension. Blood pressure reading: 140/90 mmHg.",
      recordDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      patientEmail: "patient@hospital.com",
      doctorEmail: "doctor@hospital.com",
      type: "lab_report",
      title: "Lipid Panel",
      description: "Total Cholesterol: 210, LDL: 130, HDL: 45, Triglycerides: 150",
      recordDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      patientEmail: "emily.davis@email.com",
      doctorEmail: "michael.chen@hospital.com",
      type: "imaging",
      title: "Brain MRI",
      description: "MRI scan showing no significant abnormalities. Brain structure normal.",
      recordDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const recordData of recordsData) {
    const { patientEmail, doctorEmail, ...data } = recordData;

    await prisma.medicalRecord.create({
      data: {
        ...data,
        patientId: patientIdMap[patientEmail],
        doctorId: doctorIdMap[doctorEmail],
      },
    });
  }

  console.log("Medical Records created:", recordsData.length);

  console.log("\n=== Seed completed successfully ===\n");
  console.log("Test Credentials:");
  console.log("================");
  console.log("Admin:   admin@hospital.com / admin123");
  console.log("Doctor:  doctor@hospital.com / doctor123");
  console.log("Patient: patient@hospital.com / patient123");
  console.log("\nHospital: City General Hospital");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
