export interface CardTimerConfig {
  enabled: boolean
  seconds: number
}

export const MIN_SECONDS = 5
export const MAX_SECONDS = 300
export const DEFAULT_SECONDS = 20

export const normalizeConfig = (value: unknown): CardTimerConfig => {
  const candidate = value && typeof value === 'object' ? value as Partial<CardTimerConfig> : {}
  const rawSeconds = typeof candidate.seconds === 'number' && Number.isFinite(candidate.seconds) ? candidate.seconds : DEFAULT_SECONDS
  return {
    enabled: candidate.enabled === true,
    seconds: Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, Math.round(rawSeconds))),
  }
}

