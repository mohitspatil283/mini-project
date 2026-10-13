import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { prisma } from '../config/prisma';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. No authorization token provided.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authorization token.',
    });
    return;
  }

  // Verify user still exists and is ACTIVE
  const user = await prisma.user.findUnique({
    where: { user_id: payload.user_id },
    include: { role: true },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'User account not found.',
    });
    return;
  }

  if (user.status !== 'ACTIVE') {
    res.status(403).json({
      success: false,
      error: `Account is ${user.status.toLowerCase()}. Access denied.`,
    });
    return;
  }

  req.user = {
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    role: user.role.name,
    assigned_facility_id: user.assigned_facility_id,
  };

  next();
}

export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { user_id: payload.user_id },
        include: { role: true },
      });
      if (user && user.status === 'ACTIVE') {
        req.user = {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          role: user.role.name,
          assigned_facility_id: user.assigned_facility_id,
        };
      }
    }
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
}
