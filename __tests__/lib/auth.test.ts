/**
 * @jest-environment node
 */
// __tests__/lib/auth.test.ts
process.env.JWT_SECRET = 'test-secret-key-exactly-32-chars!!'

import { signToken, verifyToken } from '@/lib/auth'

describe('signToken / verifyToken', () => {
  it('signs a token and verifies it successfully', async () => {
    const token = await signToken({ admin: true })
    const payload = await verifyToken(token)
    expect(payload.admin).toBe(true)
  })

  it('throws on a tampered token', async () => {
    const token = await signToken({ admin: true })
    await expect(verifyToken(token + 'x')).rejects.toThrow()
  })

  it('throws on an expired token', async () => {
    const token = await signToken({ admin: true }, '-1s')
    await expect(verifyToken(token)).rejects.toThrow()
  })
})
