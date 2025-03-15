import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Convert secret to Uint8Array as required by jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  try {
    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secretKey);
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Failed to create token');
  }
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    // Type assertion to ensure payload matches our JWTPayload interface
    const jwtPayload = payload as unknown as JWTPayload;
    
    // Validate required fields
    if (typeof jwtPayload.username !== 'string' || typeof jwtPayload.role !== 'string') {
      console.error('Invalid token payload structure');
      return null;
    }
    
    return jwtPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
} 