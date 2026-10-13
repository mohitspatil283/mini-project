import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mediguide-secure-jwt-secret-key-change-in-production-2026';

export interface TokenPayload {
  user_id: number;
  email: string;
  role: string;
  name: string;
  assigned_facility_id?: number | null;
}

export function generateToken(payload: TokenPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
