import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type AuditPayload = {
  userId: string;
  email?: string;
  action: string;
  target: string;
  details?: Prisma.InputJsonValue;
};

export async function logAdminAudit(payload: AuditPayload) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        userId: payload.userId,
        email: payload.email,
        action: payload.action,
        target: payload.target,
        details: payload.details,
      },
    });
  } catch (error) {
    // Audit logging should never block successful admin operations.
    console.error("[admin-audit]", error);
  }
}
