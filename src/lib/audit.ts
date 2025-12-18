// Audit log utility functions for compliance tracking

import prisma from "@/lib/prisma";

export type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "export"
  | "print"
  | "access_denied";

export type AuditResource =
  | "user"
  | "patient"
  | "doctor"
  | "appointment"
  | "prescription"
  | "medical_record"
  | "lab_test"
  | "vital_sign"
  | "invoice"
  | "payment"
  | "notification"
  | "settings"
  | "report";

interface AuditLogParams {
  userId: number;
  userType: string;
  hospitalId: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: number | string;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(params: AuditLogParams) {
  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userType: params.userType,
        hospitalId: params.hospitalId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId?.toString() || null,
        description: params.description,
        metadata: params.metadata || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });

    return auditLog;
  } catch (error) {
    // Don't throw - audit logging should not break the main flow
    console.error("Failed to create audit log:", error);
    return null;
  }
}

/**
 * Get request IP address
 */
export function getIpAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get("user-agent") || "unknown";
}

// Pre-built audit log helpers

export async function auditLogin(params: {
  userId: number;
  userType: string;
  hospitalId: string;
  userName: string;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
}) {
  await createAuditLog({
    userId: params.userId,
    userType: params.userType,
    hospitalId: params.hospitalId,
    action: "login",
    resource: "user",
    resourceId: params.userId,
    description: params.success !== false
      ? `User ${params.userName} logged in successfully`
      : `Failed login attempt for ${params.userName}`,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  });
}

export async function auditLogout(params: {
  userId: number;
  userType: string;
  hospitalId: string;
  userName: string;
}) {
  await createAuditLog({
    userId: params.userId,
    userType: params.userType,
    hospitalId: params.hospitalId,
    action: "logout",
    resource: "user",
    resourceId: params.userId,
    description: `User ${params.userName} logged out`,
  });
}

export async function auditPatientRecordAccess(params: {
  userId: number;
  userType: string;
  hospitalId: string;
  patientId: number;
  patientName: string;
  accessedBy: string;
}) {
  await createAuditLog({
    userId: params.userId,
    userType: params.userType,
    hospitalId: params.hospitalId,
    action: "read",
    resource: "patient",
    resourceId: params.patientId,
    description: `${params.accessedBy} accessed patient record for ${params.patientName}`,
    metadata: { patientId: params.patientId },
  });
}

export async function auditMedicalRecordAccess(params: {
  userId: number;
  userType: string;
  hospitalId: string;
  recordId: number;
  patientName: string;
  accessedBy: string;
}) {
  await createAuditLog({
    userId: params.userId,
    userType: params.userType,
    hospitalId: params.hospitalId,
    action: "read",
    resource: "medical_record",
    resourceId: params.recordId,
    description: `${params.accessedBy} accessed medical record for ${params.patientName}`,
    metadata: { recordId: params.recordId },
  });
}

export async function auditPrescriptionCreate(params: {
  userId: number;
  userType: string;
  hospitalId: string;
  prescriptionId: number;
  patientName: string;
  doctorName: string;
}) {
  await createAuditLog({
    userId: params.userId,
    userType: params.userType,
    hospitalId: params.hospitalId,
    action: "create",
    resource: "prescription",
    resourceId: params.prescriptionId,
    description: `Dr. ${params.doctorName} created prescription for ${params.patientName}`,
    metadata: { prescriptionId: params.prescriptionId },
  });
}

export async function auditDataExport(params: {
  userId: number;
  userType: string;
  hospitalId: string;
  exportType: string;
  recordCount: number;
  userName: string;
}) {
  await createAuditLog({
    userId: params.userId,
    userType: params.userType,
    hospitalId: params.hospitalId,
    action: "export",
    resource: "report",
    description: `${params.userName} exported ${params.recordCount} ${params.exportType} records`,
    metadata: { exportType: params.exportType, recordCount: params.recordCount },
  });
}

export async function auditAccessDenied(params: {
  userId: number;
  userType: string;
  hospitalId: string;
  resource: AuditResource;
  resourceId?: number | string;
  userName: string;
  reason: string;
  ipAddress?: string;
}) {
  await createAuditLog({
    userId: params.userId,
    userType: params.userType,
    hospitalId: params.hospitalId,
    action: "access_denied",
    resource: params.resource,
    resourceId: params.resourceId,
    description: `Access denied for ${params.userName}: ${params.reason}`,
    ipAddress: params.ipAddress,
  });
}
