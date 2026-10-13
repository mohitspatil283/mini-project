import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../utils/audit';

const router = Router();

// Public: List all healthcare services
router.get('/', async (req, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: {
            facility_services: true,
            cost_records: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      count: services.length,
      data: services.map((s) => ({
        service_id: s.service_id,
        name: s.name,
        category: s.category,
        description: s.description,
        facility_count: s._count.facility_services,
        cost_records_count: s._count.cost_records,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch services.' });
  }
});

// Admin: Create new service
router.post('/', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      res.status(400).json({
        success: false,
        error: 'Service name and category are required.',
      });
      return;
    }

    const existing = await prisma.service.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: 'A service with this name already exists.',
      });
      return;
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        description: description ? description.trim() : null,
      },
    });

    await logAuditEvent(req.user!.user_id, 'SERVICE_CREATE', 'Service', service.service_id, {
      name: service.name,
      category: service.category,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create service.' });
  }
});

// Admin: Update service
router.put('/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    const { name, category, description } = req.body;

    const existing = await prisma.service.findUnique({ where: { service_id: serviceId } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }

    const updated = await prisma.service.update({
      where: { service_id: serviceId },
      data: {
        ...(name && { name: name.trim() }),
        ...(category && { category: category.trim() }),
        ...(description !== undefined && { description: description ? description.trim() : null }),
      },
    });

    await logAuditEvent(req.user!.user_id, 'SERVICE_UPDATE', 'Service', serviceId);

    res.json({
      success: true,
      message: 'Service updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update service.' });
  }
});

// Admin: Delete service
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    await prisma.service.delete({ where: { service_id: serviceId } });

    await logAuditEvent(req.user!.user_id, 'SERVICE_DELETE', 'Service', serviceId);

    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to delete service.' });
  }
});

export default router;
