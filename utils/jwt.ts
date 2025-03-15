import * as jose from 'jose'

type JWTPayload = {
  role: string
  username: string
  iat: number
  exp: number
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
} 