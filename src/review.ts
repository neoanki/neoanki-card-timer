import { createSandboxedUiClient } from '@neo-anki/extension-sdk'
import { normalizeConfig } from './config.js'

const style = document.createElement('style')
style.textContent = `:root{color-scheme:light dark;font:16px/1.3 system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:transparent;color:#26364a}.timer{display:flex;align-items:center;gap:8px;min-height:44px;padding:4px}.value{min-width:3.25rem;font-variant-numeric:tabular-nums;font-weight:750}.track{display:block;width:96px;height:6px;overflow:hidden;border-radius:999px;background:#d7dde6}.track span{display:block;height:100%;background:#4279ad;transition:transform .2s linear;transform-origin:left}.timer.urgent .value{color:#a33a2d}.timer.urgent .track span{background:#b84a3c}:root[data-theme=dark] body{color:#e7edf5}:root[data-theme=dark] .track{background:#3e4a5c}:root[data-theme=dark] .timer.urgent .value{color:#ff9a8d}@media(prefers-reduced-motion:reduce){.track span{transition:none}}`
document.head.append(style)
const root = document.getElementById('root')!

void createSandboxedUiClient().then(async (client) => {
  document.documentElement.dataset.theme = client.init.theme
  const config = normalizeConfig(await client.call('command', { commandId: 'config.get' }))
  if (!config.enabled) return
  root.innerHTML = `<div class="timer" role="timer"><span class="value"></span><span class="track" aria-hidden="true"><span></span></span><span class="announcement" aria-live="polite"></span></div>`
  const timer = root.querySelector<HTMLElement>('.timer')!
  const value = root.querySelector<HTMLElement>('.value')!
  const bar = root.querySelector<HTMLElement>('.track span')!
  const announcement = root.querySelector<HTMLElement>('.announcement')!
  const deadline = performance.now() + config.seconds * 1000
  let last = -1
  const tick = () => {
    const remaining = Math.max(0, Math.ceil((deadline - performance.now()) / 1000))
    if (remaining === last) return
    last = remaining
    value.textContent = `${remaining}s`
    timer.classList.toggle('urgent', remaining <= 5)
    timer.setAttribute('aria-label', `${remaining} seconds remaining for this card`)
    bar.style.transform = `scaleX(${remaining / config.seconds})`
    if (remaining === 5) announcement.textContent = 'Five seconds remaining.'
    if (remaining === 0) announcement.textContent = 'Target time elapsed. Reveal and grade the card when ready.'
  }
  tick()
  const interval = window.setInterval(tick, 200)
  window.addEventListener('beforeunload', () => window.clearInterval(interval))
}).catch(() => undefined)

