// Notification utility functions for creating system notifications

import prisma from "@/lib/prisma";

export type NotificationType =
  | "appointment_booked"
  | "appointment_confirmed"
  | "appointment_cancelled"
  | "appointment_reminder"
  | "prescription_created"
  | "lab_test_ordered"
  | "lab_results_ready"
  | "invoice_created"
  | "payment_received"
  | "vital_signs_recorded"
  | "medical_record_created"
  | "system"
  | "alert";

export type UserType = "admin" | "doctor" | "patient";

interface CreateNotificationParams {
  userId: number;
  userType: UserType;
  hospitalId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        userType: params.userType,
        hospitalId: params.hospitalId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        metadata: params.metadata || null,
      },
    });

    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}

/**
 * Create notifications for multiple users
 */
export async function createNotifications(
  notifications: CreateNotificationParams[]
) {
  try {
    const result = await prisma.notification.createMany({
      data: notifications.map((n) => ({
        userId: n.userId,
        userType: n.userType,
        hospitalId: n.hospitalId,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link || null,
        metadata: n.metadata || null,
      })),
    });

    return result;
  } catch (error) {
    console.error("Failed to create notifications:", error);
    throw error;
  }
}

// Pre-built notification templates

export async function notifyAppointmentBooked(params: {
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  hospitalId: string;
  appointmentDate: Date;
  appointmentId: number;
}) {
  const dateStr = params.appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Notify doctor
  await createNotification({
    userId: params.doctorId,
    userType: "doctor",
    hospitalId: params.hospitalId,
    type: "appointment_booked",
    title: "New Appointment Booked",
    message: `${params.patientName} has booked an appointment for ${dateStr}`,
    link: `/doctor/appointments`,
    metadata: { appointmentId: params.appointmentId },
  });

  // Notify patient
  await createNotification({
    userId: params.patientId,
    userType: "patient",
    hospitalId: params.hospitalId,
    type: "appointment_booked",
    title: "Appointment Confirmed",
    message: `Your appointment with Dr. ${params.doctorName} is confirmed for ${dateStr}`,
    link: `/patient/appointments`,
    metadata: { appointmentId: params.appointmentId },
  });
}

export async function notifyLabResultsReady(params: {
  patientId: number;
  hospitalId: string;
  testName: string;
  labTestId: number;
}) {
  await createNotification({
    userId: params.patientId,
    userType: "patient",
    hospitalId: params.hospitalId,
    type: "lab_results_ready",
    title: "Lab Results Available",
    message: `Your ${params.testName} results are now available`,
    link: `/patient/lab-tests`,
    metadata: { labTestId: params.labTestId },
  });
}

export async function notifyPrescriptionCreated(params: {
  patientId: number;
  hospitalId: string;
  doctorName: string;
  prescriptionId: number;
}) {
  await createNotification({
    userId: params.patientId,
    userType: "patient",
    hospitalId: params.hospitalId,
    type: "prescription_created",
    title: "New Prescription",
    message: `Dr. ${params.doctorName} has created a new prescription for you`,
    link: `/patient/prescriptions`,
    metadata: { prescriptionId: params.prescriptionId },
  });
}

export async function notifyInvoiceCreated(params: {
  patientId: number;
  hospitalId: string;
  invoiceNumber: string;
  amount: number;
  invoiceId: number;
}) {
  const amountStr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(params.amount);

  await createNotification({
    userId: params.patientId,
    userType: "patient",
    hospitalId: params.hospitalId,
    type: "invoice_created",
    title: "New Invoice",
    message: `Invoice ${params.invoiceNumber} for ${amountStr} has been generated`,
    link: `/patient/billing`,
    metadata: { invoiceId: params.invoiceId },
  });
}

export async function notifyPaymentReceived(params: {
  patientId: number;
  hospitalId: string;
  amount: number;
  invoiceNumber: string;
}) {
  const amountStr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(params.amount);

  await createNotification({
    userId: params.patientId,
    userType: "patient",
    hospitalId: params.hospitalId,
    type: "payment_received",
    title: "Payment Confirmed",
    message: `Payment of ${amountStr} for invoice ${params.invoiceNumber} has been received`,
    link: `/patient/billing`,
  });
}

export async function notifyAppointmentReminder(params: {
  patientId: number;
  hospitalId: string;
  doctorName: string;
  appointmentDate: Date;
  appointmentId: number;
}) {
  const dateStr = params.appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  await createNotification({
    userId: params.patientId,
    userType: "patient",
    hospitalId: params.hospitalId,
    type: "appointment_reminder",
    title: "Appointment Reminder",
    message: `Reminder: You have an appointment with Dr. ${params.doctorName} on ${dateStr}`,
    link: `/patient/appointments`,
    metadata: { appointmentId: params.appointmentId },
  });
}

export async function notifyVitalSignsRecorded(params: {
  patientId: number;
  hospitalId: string;
  doctorName: string;
}) {
  await createNotification({
    userId: params.patientId,
    userType: "patient",
    hospitalId: params.hospitalId,
    type: "vital_signs_recorded",
    title: "Vital Signs Updated",
    message: `Dr. ${params.doctorName} has recorded your vital signs`,
    link: `/patient/vitals`,
  });
}
