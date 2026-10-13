import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../utils/audit';

const router = Router();

// GET /api/saved-facilities: List saved facilities for current user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const saved = await prisma.savedFacility.findMany({
      where: { user_id: req.user!.user_id },
      include: {
        facility: {
          include: {
            facility_services: {
              include: {
                service: true,
              },
            },
            cost_records: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      count: saved.length,
      data: saved.map((s) => ({
        saved_id: s.saved_id,
        saved_at: s.created_at,
        facility: {
          ...s.facility,
          services: s.facility.facility_services.map((fs) => fs.service),
          costs_count: s.facility.cost_records.length,
        },
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve saved facilities.' });
  }
});

// TC-SAVE-01: POST /api/saved-facilities/:facilityId: Save a facility
router.post('/:facilityId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const facilityId = parseInt(req.params.facilityId, 10);
    const userId = req.user!.user_id;

    if (isNaN(facilityId)) {
      res.status(400).json({ success: false, error: 'Invalid facility ID.' });
      return;
    }

    const facility = await prisma.facility.findUnique({
      where: { facility_id: facilityId },
    });

    if (!facility) {
      res.status(404).json({ success: false, error: 'Facility not found.' });
      return;
    }

    // Check duplicate save
    const existing = await prisma.savedFacility.findUnique({
      where: {
        user_id_facility_id: {
          user_id: userId,
          facility_id: facilityId,
        },
      },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: 'Facility is already saved in your bookmarks.',
      });
      return;
    }

    const saved = await prisma.savedFacility.create({
      data: {
        user_id: userId,
        facility_id: facilityId,
      },
    });

    await logAuditEvent(userId, 'FACILITY_SAVED', 'SavedFacility', saved.saved_id, {
      facility_id: facilityId,
      facility_name: facility.facility_name,
    });

    res.status(201).json({
      success: true,
      message: 'Facility saved successfully.',
      data: saved,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to save facility.' });
  }
});

// DELETE /api/saved-facilities/:facilityId: Remove saved facility
router.delete('/:facilityId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const facilityId = parseInt(req.params.facilityId, 10);
    const userId = req.user!.user_id;

    const existing = await prisma.savedFacility.findUnique({
      where: {
        user_id_facility_id: {
          user_id: userId,
          facility_id: facilityId,
        },
      },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'Facility was not saved in your bookmarks.',
      });
      return;
    }

    await prisma.savedFacility.delete({
      where: {
        user_id_facility_id: {
          user_id: userId,
          facility_id: facilityId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Facility removed from saved bookmarks.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to remove saved facility.' });
  }
});

export default router;
