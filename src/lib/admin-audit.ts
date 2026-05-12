import { prisma } from "@/lib/prisma";

type AuditPayload = {
  userId: string;
  email?: string;
  action: string;
  target: string;
  /** JSON-serializable payload for the audit row (avoid `Prisma` namespace import for CI compatibility). */
  details?: Record<string, unknown> | unknown[] | string | number | boolean | null;
};

export async function logAdminAudit(payload: AuditPayload) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        userId: payload.userId,
        email: payload.email,
        action: payload.action,
        target: payload.target,
        ...(payload.details !== undefined
          ? { details: JSON.parse(JSON.stringify(payload.details)) as object }
          : {}),
      },
    });
  } catch (error) {
    // Audit logging should never block successful admin operations.
    console.error("[admin-audit]", error);
  }
}
