import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../utils/audit';

const router = Router();

const VALID_CATEGORIES = [
  'INCORRECT_ADDRESS',
  'INCORRECT_PHONE',
  'INCORRECT_HOURS',
  'INCORRECT_SERVICE',
  'INCORRECT_COST',
  'DUPLICATE_FACILITY',
  'NO_LONGER_OPERATING',
  'OTHER',
];

// TC-REP-01: Submit report for incorrect facility information
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { facility_id, category, description } = req.body;
    const userId = req.user!.user_id;

    if (!facility_id || !category || !description) {
      res.status(400).json({
        success: false,
        error: 'Please provide facility_id, report category, and description.',
      });
      return;
    }

    if (!VALID_CATEGORIES.includes(category)) {
      res.status(400).json({
        success: false,
        error: `Invalid report category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
      return;
    }

    const facilityId = parseInt(facility_id, 10);
    const facility = await prisma.facility.findUnique({
      where: { facility_id: facilityId },
    });

    if (!facility) {
      res.status(404).json({ success: false, error: 'Target facility not found.' });
      return;
    }

    const report = await prisma.report.create({
      data: {
        facility_id: facilityId,
        user_id: userId,
        category,
        description: description.trim(),
        status: 'OPEN',
      },
      include: {
        facility: {
          select: {
            facility_name: true,
            address: true,
            city: true,
          },
        },
      },
    });

    await logAuditEvent(userId, 'REPORT_SUBMIT', 'Report', report.report_id, {
      facility_id: facilityId,
      facility_name: facility.facility_name,
      category,
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. MediGuide administrators will review the reported details.',
      data: report,
    });
  } catch (error: any) {
    console.error('Report submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit report.' });
  }
});

// Get reports submitted by current user
router.get('/my-reports', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      where: { user_id: req.user!.user_id },
      include: {
        facility: {
          select: {
            facility_id: true,
            facility_name: true,
            facility_type: true,
            city: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve reports.' });
  }
});

export default router;
