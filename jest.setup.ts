// jest.setup.ts
import '@testing-library/jest-dom'

// Polyfill Web APIs needed by jose and other packages in jsdom environment
import { TextEncoder, TextDecoder } from 'util'
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
}
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = <T>(v: T): T => JSON.parse(JSON.stringify(v))
}
