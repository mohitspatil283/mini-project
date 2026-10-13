import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../utils/audit';

const router = Router();

// Middleware ensuring user is a Facility Representative with an assigned facility
const verifyRepFacility = async (req: AuthRequest, res: Response, next: Function) => {
  if (req.user!.role !== 'FACILITY_REPRESENTATIVE') {
    res.status(403).json({ success: false, error: 'Access restricted to facility representatives.' });
    return;
  }
  if (!req.user!.assigned_facility_id) {
    res.status(400).json({
      success: false,
      error: 'No healthcare facility is currently assigned to your account. Please contact an administrator.',
    });
    return;
  }
  next();
};

// GET /api/rep/dashboard: Complete representative dashboard overview
router.get(
  '/dashboard',
  authenticate,
  requireRole('FACILITY_REPRESENTATIVE'),
  verifyRepFacility,
  async (req: AuthRequest, res: Response) => {
    try {
      const facilityId = req.user!.assigned_facility_id!;

      const facility = await prisma.facility.findUnique({
        where: { facility_id: facilityId },
        include: {
          facility_services: {
            include: { service: true },
          },
          cost_records: {
            include: { service: true },
            orderBy: { updated_at: 'desc' },
          },
          revisions: {
            orderBy: { created_at: 'desc' },
            take: 5,
          },
          reports: {
            where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } },
            orderBy: { created_at: 'desc' },
          },
        },
      });

      if (!facility) {
        res.status(404).json({ success: false, error: 'Assigned facility not found.' });
        return;
      }

      res.json({
        success: true,
        data: {
          facility: {
            facility_id: facility.facility_id,
            facility_name: facility.facility_name,
            facility_type: facility.facility_type,
            address: facility.address,
            city: facility.city,
            state: facility.state,
            pincode: facility.pincode,
            phone: facility.phone,
            email: facility.email,
            operating_hours: facility.operating_hours,
            status: facility.status,
            verified_at: facility.verified_at,
          },
          services: facility.facility_services.map((fs) => fs.service),
          cost_records: facility.cost_records,
          pending_revisions: facility.revisions.filter((r) => r.status === 'PENDING'),
          recent_revisions: facility.revisions,
          active_reports: facility.reports,
        },
      });
    } catch (error: any) {
      console.error('Rep dashboard error:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve representative dashboard.' });
    }
  }
);

// POST /api/rep/propose-update: Submit facility changes (enters revision workflow)
router.post(
  '/propose-update',
  authenticate,
  requireRole('FACILITY_REPRESENTATIVE'),
  verifyRepFacility,
  async (req: AuthRequest, res: Response) => {
    try {
      const facilityId = req.user!.assigned_facility_id!;
      const { phone, email, operating_hours, address } = req.body;

      const currentFacility = await prisma.facility.findUnique({
        where: { facility_id: facilityId },
      });

      if (!currentFacility) {
        res.status(404).json({ success: false, error: 'Facility not found.' });
        return;
      }

      const existingData = {
        phone: currentFacility.phone,
        email: currentFacility.email,
        operating_hours: currentFacility.operating_hours,
        address: currentFacility.address,
      };

      const proposedData: any = {};
      if (phone !== undefined) proposedData.phone = phone.trim();
      if (email !== undefined) proposedData.email = email.trim();
      if (operating_hours !== undefined) proposedData.operating_hours = operating_hours.trim();
      if (address !== undefined) proposedData.address = address.trim();

      const revision = await prisma.facilityRevision.create({
        data: {
          facility_id: facilityId,
          submitted_by: req.user!.user_id,
          existing_data: JSON.stringify(existingData),
          proposed_data: JSON.stringify(proposedData),
          status: 'PENDING',
        },
      });

      await logAuditEvent(
        req.user!.user_id,
        'REVISION_SUBMIT',
        'FacilityRevision',
        revision.revision_id,
        {
          facility_id: facilityId,
          facility_name: currentFacility.facility_name,
        }
      );

      res.status(201).json({
        success: true,
        message: 'Facility revision submitted for administrator review and verification.',
        data: revision,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to submit facility revision.' });
    }
  }
);

// POST /api/rep/services: Add service to assigned facility
router.post(
  '/services',
  authenticate,
  requireRole('FACILITY_REPRESENTATIVE'),
  verifyRepFacility,
  async (req: AuthRequest, res: Response) => {
    try {
      const facilityId = req.user!.assigned_facility_id!;
      const { service_id } = req.body;

      if (!service_id) {
        res.status(400).json({ success: false, error: 'Please specify a service_id.' });
        return;
      }

      const svcId = parseInt(service_id, 10);
      const service = await prisma.service.findUnique({ where: { service_id: svcId } });
      if (!service) {
        res.status(404).json({ success: false, error: 'Service not found in catalog.' });
        return;
      }

      const fs = await prisma.facilityService.upsert({
        where: {
          facility_id_service_id: {
            facility_id: facilityId,
            service_id: svcId,
          },
        },
        update: { is_available: true },
        create: {
          facility_id: facilityId,
          service_id: svcId,
          is_available: true,
        },
      });

      await logAuditEvent(req.user!.user_id, 'FACILITY_SERVICE_ADD', 'FacilityService', fs.facility_service_id, {
        facility_id: facilityId,
        service_id: svcId,
      });

      res.status(201).json({
        success: true,
        message: `Service '${service.name}' added to your facility successfully.`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to add service.' });
    }
  }
);

// DELETE /api/rep/services/:serviceId: Remove service from assigned facility
router.delete(
  '/services/:serviceId',
  authenticate,
  requireRole('FACILITY_REPRESENTATIVE'),
  verifyRepFacility,
  async (req: AuthRequest, res: Response) => {
    try {
      const facilityId = req.user!.assigned_facility_id!;
      const serviceId = parseInt(req.params.serviceId, 10);

      await prisma.facilityService.deleteMany({
        where: {
          facility_id: facilityId,
          service_id: serviceId,
        },
      });

      await logAuditEvent(req.user!.user_id, 'FACILITY_SERVICE_REMOVE', 'FacilityService', serviceId, {
        facility_id: facilityId,
      });

      res.json({
        success: true,
        message: 'Service removed from facility offering.',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to remove service.' });
    }
  }
);

// GET /api/rep/revisions: List all revisions submitted by this representative
router.get(
  '/revisions',
  authenticate,
  requireRole('FACILITY_REPRESENTATIVE'),
  async (req: AuthRequest, res: Response) => {
    try {
      const revisions = await prisma.facilityRevision.findMany({
        where: { submitted_by: req.user!.user_id },
        include: {
          facility: {
            select: {
              facility_id: true,
              facility_name: true,
              status: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      res.json({
        success: true,
        count: revisions.length,
        data: revisions,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch revisions.' });
    }
  }
);

export default router;
