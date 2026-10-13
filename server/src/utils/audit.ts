import { prisma } from '../config/prisma';

export async function logAuditEvent(
  userId: number | null,
  action: string,
  entity: string,
  entityId: string | number,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await prisma.auditEvent.create({
      data: {
        user_id: userId,
        action,
        entity,
        entity_id: String(entityId),
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}
