// __tests__/portfolio/styles.test.ts
// Adaptive-preference stylesheet assertions.
//
// jsdom cannot evaluate `prefers-reduced-motion`, `prefers-reduced-transparency`,
// `prefers-contrast`, or `prefers-color-scheme`, so the automated coverage for
// those media features is a stylesheet-level check: the public contract in
// app/globals.css must contain each override, and the root layout must emit the
// color-scheme meta. This is intentionally a presence check, not a value check;
// actual rendering under each preference is verified in the manual review.
import fs from 'node:fs'
import path from 'node:path'

const globalsCss = fs.readFileSync(path.join(process.cwd(), 'app', 'globals.css'), 'utf-8')
const rootLayout = fs.readFileSync(path.join(process.cwd(), 'app', 'layout.tsx'), 'utf-8')

describe('Adaptive preference styles (stylesheet-level assertions)', () => {
  it('declares an adaptive color-scheme so native controls/scrollbars follow the OS', () => {
    expect(globalsCss).toMatch(/color-scheme:\s*light dark/)
  })

  it('provides a dark document palette driven by prefers-color-scheme', () => {
    expect(globalsCss).toMatch(/@media \(prefers-color-scheme: dark\)/)
  })

  it('neutralizes motion under prefers-reduced-motion', () => {
    expect(globalsCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })

  it('solidifies the translucent surfaces under prefers-reduced-transparency', () => {
    expect(globalsCss).toMatch(/@media \(prefers-reduced-transparency: reduce\)/)
  })

  it('strengthens contrast boundaries under prefers-contrast: more', () => {
    expect(globalsCss).toMatch(/@media \(prefers-contrast: more\)/)
  })

  it('emits the color-scheme viewport meta from the root layout', () => {
    expect(rootLayout).toMatch(/colorScheme:\s*['"]light dark['"]/)
  })
})
