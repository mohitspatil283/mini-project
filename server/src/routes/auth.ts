import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateToken } from '../utils/jwt';
import { logAuditEvent } from '../utils/audit';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// TC-AUTH-01 & TC-AUTH-02: User Registration
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, email, and password.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
      return;
    }

    // Check duplicate account
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
      return;
    }

    // Default role is USER (role_id: 2)
    const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
    const roleId = userRole ? userRole.id : 2;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        password_hash,
        role_id: roleId,
        status: 'ACTIVE',
      },
      include: { role: true },
    });

    await logAuditEvent(newUser.user_id, 'USER_REGISTER', 'User', newUser.user_id, {
      email: newUser.email,
      role: newUser.role.name,
    });

    const token = generateToken({
      user_id: newUser.user_id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role.name,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role.name,
        status: newUser.status,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// TC-AUTH-03 & TC-AUTH-04: User Login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please enter both email and password.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        role: true,
        assigned_facility: {
          select: {
            facility_id: true,
            facility_name: true,
            facility_type: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    if (user.status !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        error: `Your account is ${user.status.toLowerCase()}. Please contact administrator support.`,
      });
      return;
    }

    const token = generateToken({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      assigned_facility_id: user.assigned_facility_id,
    });

    await logAuditEvent(user.user_id, 'USER_LOGIN', 'User', user.user_id, {
      email: user.email,
      role: user.role.name,
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        status: user.status,
        assigned_facility: user.assigned_facility,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

// Current User Details
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user!.user_id },
      include: {
        role: true,
        assigned_facility: {
          select: {
            facility_id: true,
            facility_name: true,
            facility_type: true,
            address: true,
            city: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        status: user.status,
        assigned_facility: user.assigned_facility,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch user profile.' });
  }
});

// Update Profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const userId = req.user!.user_id;

    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ success: false, error: 'Current password is required to set a new password.' });
        return;
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        res.status(400).json({ success: false, error: 'Incorrect current password.' });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: updateData,
      include: { role: true },
    });

    await logAuditEvent(userId, 'USER_PROFILE_UPDATE', 'User', userId);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        user_id: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role.name,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  await logAuditEvent(req.user!.user_id, 'USER_LOGOUT', 'User', req.user!.user_id);
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
