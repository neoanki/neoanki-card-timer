import { describe, expect, it } from 'vitest'
import { DEFAULT_SECONDS, MAX_SECONDS, MIN_SECONDS, normalizeConfig } from './config.js'

describe('card timer config', () => {
  it('defaults safely', () => expect(normalizeConfig(null)).toEqual({ enabled: false, seconds: DEFAULT_SECONDS }))
  it('clamps the target duration', () => {
    expect(normalizeConfig({ enabled: true, seconds: 1 }).seconds).toBe(MIN_SECONDS)
    expect(normalizeConfig({ enabled: true, seconds: 999 }).seconds).toBe(MAX_SECONDS)
  })
})

