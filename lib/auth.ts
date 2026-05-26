// lib/auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

export const COOKIE_NAME = 'admin-session'

export async function signToken(
  payload: Record<string, unknown>,
  expiresIn = '7d'
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret())
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret())
  return payload
}
