import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../utils/audit';

const router = Router();

// TC-COST-01: Cost Comparison across multiple facilities
router.get('/compare', async (req, res: Response) => {
  try {
    const { facility_ids, service_id } = req.query;

    if (!facility_ids) {
      res.status(400).json({
        success: false,
        error: 'Please select at least two facilities to compare.',
      });
      return;
    }

    const ids = String(facility_ids)
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length < 2) {
      res.status(400).json({
        success: false,
        error: 'Please select at least two valid facilities to compare costs.',
      });
      return;
    }

    // Fetch facilities
    const facilities = await prisma.facility.findMany({
      where: {
        facility_id: { in: ids },
      },
      select: {
        facility_id: true,
        facility_name: true,
        facility_type: true,
        address: true,
        city: true,
        phone: true,
        status: true,
      },
    });

    if (facilities.length === 0) {
      res.status(404).json({ success: false, error: 'No matching facilities found.' });
      return;
    }

    // Build service filter
    const serviceFilter: any = {};
    if (service_id) {
      serviceFilter.service_id = parseInt(String(service_id), 10);
    }

    // Get all relevant services
    const services = await prisma.service.findMany({
      where: serviceFilter,
      orderBy: { name: 'asc' },
    });

    // Fetch all cost records for these facilities
    const costRecords = await prisma.costRecord.findMany({
      where: {
        facility_id: { in: ids },
        ...(service_id ? { service_id: parseInt(String(service_id), 10) } : {}),
      },
      include: {
        service: true,
      },
    });

    // Fetch facility services to know which facilities offer which services
    const facilityServices = await prisma.facilityService.findMany({
      where: {
        facility_id: { in: ids },
      },
    });

    // Build comparison matrix
    const comparisonRows = services.map((svc) => {
      const facilityComparisons: Record<number, any> = {};

      facilities.forEach((fac) => {
        const isOffered = facilityServices.some(
          (fs) => fs.facility_id === fac.facility_id && fs.service_id === svc.service_id
        );

        const record = costRecords.find(
          (c) => c.facility_id === fac.facility_id && c.service_id === svc.service_id
        );

        if (record) {
          facilityComparisons[fac.facility_id] = {
            offered: true,
            cost_available: true,
            amount_min: record.amount_min,
            amount_max: record.amount_max,
            is_fixed: record.amount_min === record.amount_max,
            formatted_cost:
              record.amount_min === record.amount_max
                ? `₹${record.amount_min.toLocaleString('en-IN')}`
                : `₹${record.amount_min.toLocaleString('en-IN')} - ₹${record.amount_max.toLocaleString('en-IN')}`,
            currency: record.currency,
            unit_basis: record.unit_basis,
            source: record.source,
            verification_status: record.verification_status,
            collected_date: record.collected_date,
            verified_at: record.verified_at,
          };
        } else if (isOffered) {
          facilityComparisons[fac.facility_id] = {
            offered: true,
            cost_available: false,
            display_text: 'Cost information unavailable',
          };
        } else {
          facilityComparisons[fac.facility_id] = {
            offered: false,
            cost_available: false,
            display_text: 'Service not offered',
          };
        }
      });

      return {
        service_id: svc.service_id,
        service_name: svc.name,
        service_category: svc.category,
        facilities: facilityComparisons,
      };
    });

    res.json({
      success: true,
      facilities,
      matrix: comparisonRows,
      disclaimer:
        'Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges with the healthcare facility.',
    });
  } catch (error: any) {
    console.error('Cost compare error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate cost comparison.' });
  }
});

// TC-COST-02: Submit cost record with strict range validation
router.post(
  '/submit',
  authenticate,
  requireRole('FACILITY_REPRESENTATIVE', 'ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        facility_id,
        service_id,
        amount_min,
        amount_max,
        currency = 'INR',
        unit_basis = 'per consultation',
        source,
      } = req.body;

      if (!facility_id || !service_id || amount_min === undefined || amount_max === undefined) {
        res.status(400).json({
          success: false,
          error: 'Please provide facility_id, service_id, amount_min, and amount_max.',
        });
        return;
      }

      const min = parseFloat(amount_min);
      const max = parseFloat(amount_max);

      // TC-COST-02 Check: amount_min must not be greater than amount_max
      if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
        res.status(400).json({
          success: false,
          error: 'Cost amounts must be valid non-negative numbers.',
        });
        return;
      }

      if (min > max) {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Minimum cost cannot be greater than maximum cost.',
        });
        return;
      }

      // If Facility Representative, ensure they are assigned to this facility
      if (req.user!.role === 'FACILITY_REPRESENTATIVE') {
        if (req.user!.assigned_facility_id !== parseInt(facility_id, 10)) {
          res.status(403).json({
            success: false,
            error: 'Unauthorized: You can only submit costs for your assigned healthcare facility.',
          });
          return;
        }
      }

      // Check or create facility_service linkage
      const facId = parseInt(facility_id, 10);
      const svcId = parseInt(service_id, 10);

      await prisma.facilityService.upsert({
        where: {
          facility_id_service_id: {
            facility_id: facId,
            service_id: svcId,
          },
        },
        update: { is_available: true },
        create: {
          facility_id: facId,
          service_id: svcId,
          is_available: true,
        },
      });

      // Admin submissions can be auto-verified, Representative submissions are PENDING
      const verificationStatus = req.user!.role === 'ADMIN' ? 'VERIFIED' : 'PENDING';
      const verifiedAt = req.user!.role === 'ADMIN' ? new Date() : null;
      const verifiedBy = req.user!.role === 'ADMIN' ? req.user!.user_id : null;

      // Upsert cost record
      const existingRecord = await prisma.costRecord.findFirst({
        where: { facility_id: facId, service_id: svcId },
      });

      let costRecord;
      if (existingRecord) {
        costRecord = await prisma.costRecord.update({
          where: { cost_id: existingRecord.cost_id },
          data: {
            amount_min: min,
            amount_max: max,
            currency,
            unit_basis,
            source: source || 'Facility Representative Submission',
            verification_status: verificationStatus,
            verified_at: verifiedAt,
            verified_by: verifiedBy,
            collected_date: new Date(),
          },
        });
      } else {
        costRecord = await prisma.costRecord.create({
          data: {
            facility_id: facId,
            service_id: svcId,
            amount_min: min,
            amount_max: max,
            currency,
            unit_basis,
            source: source || 'Facility Representative Submission',
            verification_status: verificationStatus,
            verified_at: verifiedAt,
            verified_by: verifiedBy,
            collected_date: new Date(),
          },
        });
      }

      await logAuditEvent(
        req.user!.user_id,
        'COST_SUBMIT',
        'CostRecord',
        costRecord.cost_id,
        {
          facility_id: facId,
          service_id: svcId,
          amount_min: min,
          amount_max: max,
          verification_status: verificationStatus,
        }
      );

      res.status(201).json({
        success: true,
        message:
          verificationStatus === 'VERIFIED'
            ? 'Cost record published and verified successfully.'
            : 'Cost record submitted successfully and queued for admin verification.',
        data: costRecord,
      });
    } catch (error: any) {
      console.error('Submit cost error:', error);
      res.status(500).json({ success: false, error: 'Failed to submit cost record.' });
    }
  }
);

export default router;
