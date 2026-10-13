import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { logAuditEvent } from '../utils/audit';

const router = Router();

// Protect ALL admin routes with RBAC check
router.use(authenticate);
router.use(requireRole('ADMIN'));

// 1. Live Database Statistics (No mock data)
router.get('/statistics', async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalFacilities,
      verifiedFacilities,
      pendingFacilities,
      rejectedFacilities,
      totalServices,
      pendingReports,
      totalReports,
      pendingRevisions,
      verifiedCosts,
      pendingCosts,
      facilitiesByTypeRaw,
      reportsByStatusRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.facility.count(),
      prisma.facility.count({ where: { status: 'VERIFIED' } }),
      prisma.facility.count({ where: { status: 'PENDING' } }),
      prisma.facility.count({ where: { status: 'REJECTED' } }),
      prisma.service.count(),
      prisma.report.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
      prisma.report.count(),
      prisma.facilityRevision.count({ where: { status: 'PENDING' } }),
      prisma.costRecord.count({ where: { verification_status: 'VERIFIED' } }),
      prisma.costRecord.count({ where: { verification_status: 'PENDING' } }),
      prisma.facility.groupBy({
        by: ['facility_type'],
        _count: { facility_id: true },
      }),
      prisma.report.groupBy({
        by: ['status'],
        _count: { report_id: true },
      }),
    ]);

    const facilitiesByType: Record<string, number> = {};
    facilitiesByTypeRaw.forEach((f) => {
      facilitiesByType[f.facility_type] = f._count.facility_id;
    });

    const reportsByStatus: Record<string, number> = {};
    reportsByStatusRaw.forEach((r) => {
      reportsByStatus[r.status] = r._count.report_id;
    });

    res.json({
      success: true,
      data: {
        kpi: {
          totalUsers,
          totalFacilities,
          verifiedFacilities,
          pendingFacilities,
          rejectedFacilities,
          totalServices,
          pendingReports,
          totalReports,
          pendingRevisions,
          verifiedCosts,
          pendingCosts,
        },
        facilitiesByType,
        reportsByStatus,
      },
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve administrative statistics.' });
  }
});

// 2. User Management
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { role, search } = req.query;

    const where: any = {};
    if (role && role !== 'ALL') {
      where.role = { name: String(role) };
    }
    if (search) {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: true,
        assigned_facility: {
          select: {
            facility_id: true,
            facility_name: true,
          },
        },
        _count: {
          select: {
            saved_facilities: true,
            reports: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      count: users.length,
      data: users.map((u) => ({
        user_id: u.user_id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role.name,
        status: u.status,
        assigned_facility: u.assigned_facility,
        saved_count: u._count.saved_facilities,
        reports_count: u._count.reports,
        created_at: u.created_at,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve users.' });
  }
});

// Update user account status (ACTIVE, SUSPENDED)
router.put('/users/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid user status.' });
      return;
    }

    // Prevent admin from suspending themselves
    if (userId === req.user!.user_id && status === 'SUSPENDED') {
      res.status(400).json({ success: false, error: 'Cannot suspend your own administrator account.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { user_id: userId },
      data: { status },
      include: { role: true },
    });

    await logAuditEvent(req.user!.user_id, 'USER_STATUS_CHANGE', 'User', userId, {
      new_status: status,
      target_user: updated.email,
    });

    res.json({
      success: true,
      message: `User status changed to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update user status.' });
  }
});

// Assign Facility Representative
router.put('/users/:id/assign-facility', async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { facility_id } = req.body;

    const repRole = await prisma.role.findUnique({ where: { name: 'FACILITY_REPRESENTATIVE' } });
    if (!repRole) {
      res.status(500).json({ success: false, error: 'Role not configured.' });
      return;
    }

    let facId: number | null = null;
    let facilityName = 'None';
    if (facility_id) {
      facId = parseInt(facility_id, 10);
      const fac = await prisma.facility.findUnique({ where: { facility_id: facId } });
      if (!fac) {
        res.status(404).json({ success: false, error: 'Facility not found.' });
        return;
      }
      facilityName = fac.facility_name;
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        role_id: facId ? repRole.id : 2, // Revert to USER if unassigning
        assigned_facility_id: facId,
      },
      include: { role: true, assigned_facility: true },
    });

    await logAuditEvent(req.user!.user_id, 'REP_ASSIGNED', 'User', userId, {
      facility_id: facId,
      facility_name: facilityName,
      role: updatedUser.role.name,
    });

    res.json({
      success: true,
      message: facId
        ? `User successfully designated as Facility Representative for ${facilityName}.`
        : 'Facility assignment removed. Role reverted to USER.',
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to assign facility representative.' });
  }
});

// 3. Facility Management
router.get('/facilities', async (req: AuthRequest, res: Response) => {
  try {
    const { status, type, search } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = String(status);
    }
    if (type && type !== 'ALL') {
      where.facility_type = String(type);
    }
    if (search) {
      const q = String(search).trim();
      where.OR = [
        { facility_name: { contains: q } },
        { address: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const facilities = await prisma.facility.findMany({
      where,
      include: {
        _count: {
          select: {
            facility_services: true,
            cost_records: true,
            reports: true,
            revisions: true,
          },
        },
        representatives: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve facilities.' });
  }
});

// Admin: Add new facility
router.post('/facilities', async (req: AuthRequest, res: Response) => {
  try {
    const {
      facility_name,
      facility_type,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      phone,
      email,
      operating_hours,
      status = 'VERIFIED',
    } = req.body;

    if (!facility_name || !facility_type || !address || !city || !state || !pincode || !phone) {
      res.status(400).json({
        success: false,
        error: 'Please fill in all mandatory facility fields.',
      });
      return;
    }

    const lat = parseFloat(latitude) || 28.6139;
    const lng = parseFloat(longitude) || 77.2090;

    const facility = await prisma.facility.create({
      data: {
        facility_name: facility_name.trim(),
        facility_type,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        latitude: lat,
        longitude: lng,
        phone: phone.trim(),
        email: email ? email.trim() : null,
        operating_hours: operating_hours ? operating_hours.trim() : '24 Hours Open',
        status,
        verified_at: status === 'VERIFIED' ? new Date() : null,
        verified_by: status === 'VERIFIED' ? req.user!.user_id : null,
      },
    });

    await logAuditEvent(req.user!.user_id, 'FACILITY_CREATE', 'Facility', facility.facility_id, {
      facility_name: facility.facility_name,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Facility created successfully.',
      data: facility,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create facility.' });
  }
});

// Admin: Edit facility directly
router.put('/facilities/:id', async (req: AuthRequest, res: Response) => {
  try {
    const facilityId = parseInt(req.params.id, 10);
    const {
      facility_name,
      facility_type,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      phone,
      email,
      operating_hours,
      status,
    } = req.body;

    const updated = await prisma.facility.update({
      where: { facility_id: facilityId },
      data: {
        ...(facility_name && { facility_name: facility_name.trim() }),
        ...(facility_type && { facility_type }),
        ...(address && { address: address.trim() }),
        ...(city && { city: city.trim() }),
        ...(state && { state: state.trim() }),
        ...(pincode && { pincode: pincode.trim() }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
        ...(phone && { phone: phone.trim() }),
        ...(email !== undefined && { email: email ? email.trim() : null }),
        ...(operating_hours && { operating_hours: operating_hours.trim() }),
        ...(status && { status }),
      },
    });

    await logAuditEvent(req.user!.user_id, 'FACILITY_UPDATE', 'Facility', facilityId, {
      facility_name: updated.facility_name,
    });

    res.json({
      success: true,
      message: 'Facility updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update facility.' });
  }
});

// TC-ADMIN-01: Admin verifies or rejects a facility
router.put('/facilities/:id/verify', async (req: AuthRequest, res: Response) => {
  try {
    const facilityId = parseInt(req.params.id, 10);
    const { action } = req.body; // 'APPROVE' or 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(action)) {
      res.status(400).json({
        success: false,
        error: "Action must be 'APPROVE' or 'REJECT'.",
      });
      return;
    }

    const newStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

    const facility = await prisma.facility.update({
      where: { facility_id: facilityId },
      data: {
        status: newStatus,
        verified_at: new Date(),
        verified_by: req.user!.user_id,
      },
    });

    await logAuditEvent(
      req.user!.user_id,
      action === 'APPROVE' ? 'FACILITY_VERIFY' : 'FACILITY_REJECT',
      'Facility',
      facilityId,
      {
        facility_name: facility.facility_name,
        new_status: newStatus,
      }
    );

    res.json({
      success: true,
      message: `Facility status updated to ${newStatus}.`,
      data: facility,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to verify facility.' });
  }
});

// Admin: Archive or delete facility
router.delete('/facilities/:id', async (req: AuthRequest, res: Response) => {
  try {
    const facilityId = parseInt(req.params.id, 10);
    const { archive_only } = req.query;

    if (archive_only === 'true') {
      const updated = await prisma.facility.update({
        where: { facility_id: facilityId },
        data: { status: 'ARCHIVED' },
      });
      await logAuditEvent(req.user!.user_id, 'FACILITY_ARCHIVE', 'Facility', facilityId);
      res.json({ success: true, message: 'Facility archived successfully.', data: updated });
    } else {
      await prisma.facility.delete({ where: { facility_id: facilityId } });
      await logAuditEvent(req.user!.user_id, 'FACILITY_DELETE', 'Facility', facilityId);
      res.json({ success: true, message: 'Facility permanently deleted.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to delete/archive facility.' });
  }
});

// 4. Verification Queue: Revisions
router.get('/verification-queue', async (req: AuthRequest, res: Response) => {
  try {
    const pendingFacilities = await prisma.facility.findMany({
      where: { status: 'PENDING' },
      include: {
        facility_services: { include: { service: true } },
        cost_records: true,
      },
      orderBy: { created_at: 'asc' },
    });

    const pendingRevisions = await prisma.facilityRevision.findMany({
      where: { status: 'PENDING' },
      include: {
        facility: {
          select: {
            facility_id: true,
            facility_name: true,
            city: true,
            status: true,
          },
        },
        submitter: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });

    res.json({
      success: true,
      data: {
        pending_facilities: pendingFacilities,
        pending_revisions: pendingRevisions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve verification queue.' });
  }
});

// Review Revision: Approve or Reject
router.put('/revisions/:id/review', async (req: AuthRequest, res: Response) => {
  try {
    const revisionId = parseInt(req.params.id, 10);
    const { action, review_notes } = req.body; // 'APPROVE' or 'REJECT' or 'CORRECTION_REQUESTED'

    const revision = await prisma.facilityRevision.findUnique({
      where: { revision_id: revisionId },
      include: { facility: true },
    });

    if (!revision) {
      res.status(404).json({ success: false, error: 'Revision record not found.' });
      return;
    }

    if (action === 'APPROVE') {
      const proposed = JSON.parse(revision.proposed_data);
      // Apply changes to the facility
      await prisma.$transaction([
        prisma.facility.update({
          where: { facility_id: revision.facility_id },
          data: proposed,
        }),
        prisma.facilityRevision.update({
          where: { revision_id: revisionId },
          data: {
            status: 'APPROVED',
            reviewed_by: req.user!.user_id,
            review_notes: review_notes || 'Approved by administrator',
            reviewed_at: new Date(),
          },
        }),
      ]);

      await logAuditEvent(req.user!.user_id, 'REVISION_APPROVE', 'FacilityRevision', revisionId, {
        facility_id: revision.facility_id,
      });

      res.json({
        success: true,
        message: 'Revision approved and changes applied to the facility profile.',
      });
    } else {
      const newStatus = action === 'CORRECTION_REQUESTED' ? 'CORRECTION_REQUESTED' : 'REJECTED';
      await prisma.facilityRevision.update({
        where: { revision_id: revisionId },
        data: {
          status: newStatus,
          reviewed_by: req.user!.user_id,
          review_notes: review_notes || `Revision ${newStatus.toLowerCase()} by administrator`,
          reviewed_at: new Date(),
        },
      });

      await logAuditEvent(req.user!.user_id, `REVISION_${newStatus}`, 'FacilityRevision', revisionId);

      res.json({
        success: true,
        message: `Revision marked as ${newStatus}.`,
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to review revision.' });
  }
});

// 5. Cost Verification
router.get('/costs', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && status !== 'ALL') {
      where.verification_status = String(status);
    }

    const costs = await prisma.costRecord.findMany({
      where,
      include: {
        facility: {
          select: {
            facility_id: true,
            facility_name: true,
            city: true,
          },
        },
        service: true,
      },
      orderBy: { updated_at: 'desc' },
    });

    res.json({
      success: true,
      count: costs.length,
      data: costs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve cost records.' });
  }
});

// Verify Cost Record
router.put('/costs/:id/verify', async (req: AuthRequest, res: Response) => {
  try {
    const costId = parseInt(req.params.id, 10);
    const { action } = req.body; // 'APPROVE' or 'REJECT'

    const newStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

    const costRecord = await prisma.costRecord.update({
      where: { cost_id: costId },
      data: {
        verification_status: newStatus,
        verified_at: new Date(),
        verified_by: req.user!.user_id,
      },
      include: {
        facility: true,
        service: true,
      },
    });

    await logAuditEvent(req.user!.user_id, 'COST_VERIFY', 'CostRecord', costId, {
      facility_name: costRecord.facility.facility_name,
      service_name: costRecord.service.name,
      status: newStatus,
    });

    res.json({
      success: true,
      message: `Cost record marked as ${newStatus}.`,
      data: costRecord,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to verify cost record.' });
  }
});

// 6. Report Management
router.get('/reports', async (req: AuthRequest, res: Response) => {
  try {
    const { status, category } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (category && category !== 'ALL') where.category = String(category);

    const reports = await prisma.report.findMany({
      where,
      include: {
        facility: {
          select: {
            facility_id: true,
            facility_name: true,
            address: true,
            city: true,
          },
        },
        reporter: {
          select: {
            user_id: true,
            name: true,
            email: true,
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

// Update Report Status
router.put('/reports/:id', async (req: AuthRequest, res: Response) => {
  try {
    const reportId = parseInt(req.params.id, 10);
    const { status, admin_notes } = req.body;

    if (!['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid report status.' });
      return;
    }

    const report = await prisma.report.update({
      where: { report_id: reportId },
      data: {
        status,
        ...(admin_notes !== undefined && { admin_notes: admin_notes ? admin_notes.trim() : null }),
      },
      include: { facility: true },
    });

    await logAuditEvent(req.user!.user_id, 'REPORT_RESOLVE', 'Report', reportId, {
      status,
      facility_name: report.facility.facility_name,
    });

    res.json({
      success: true,
      message: `Report status updated to ${status}.`,
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update report status.' });
  }
});

// 7. Audit Logs
router.get('/audit-logs', async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '50', offset = '0', action } = req.query;

    const where: any = {};
    if (action) where.action = String(action);

    const [logs, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: parseInt(String(limit), 10),
        skip: parseInt(String(offset), 10),
      }),
      prisma.auditEvent.count({ where }),
    ]);

    res.json({
      success: true,
      total,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve audit logs.' });
  }
});

export default router;
