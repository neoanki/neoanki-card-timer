import { createSandboxedUiClient } from '@neo-anki/extension-sdk'
import { MAX_SECONDS, MIN_SECONDS, normalizeConfig, type CardTimerConfig } from './config.js'
import { installBaseStyles } from './ui.js'

installBaseStyles()
const root = document.getElementById('root')!
root.innerHTML = `<main class="panel" aria-busy="true"><div class="heading"><div><strong>Card timer</strong><p>Choose a target time for each review card.</p></div><label class="switch"><input id="enabled" type="checkbox" disabled><span>Disabled</span></label></div><label class="field" for="seconds">Seconds per card<input id="seconds" type="number" min="${MIN_SECONDS}" max="${MAX_SECONDS}" step="5" disabled></label><p class="note">At zero, NeoAnki only announces that the target elapsed. It never records a grade automatically.</p><button class="save" type="button" disabled>Save settings</button><p class="status" role="status" aria-live="polite">Loading settings…</p></main>`
const enabled = root.querySelector<HTMLInputElement>('#enabled')!
const seconds = root.querySelector<HTMLInputElement>('#seconds')!
const enabledLabel = root.querySelector<HTMLSpanElement>('.switch span')!
const save = root.querySelector<HTMLButtonElement>('.save')!
const status = root.querySelector<HTMLElement>('.status')!

const render = (config: CardTimerConfig) => {
  enabled.checked = config.enabled
  enabledLabel.textContent = config.enabled ? 'Enabled' : 'Disabled'
  seconds.value = String(config.seconds)
  seconds.disabled = !config.enabled
}

void createSandboxedUiClient().then(async (client) => {
  document.documentElement.dataset.theme = client.init.theme
  const call = <T,>(commandId: string, payload?: unknown) => client.call<T>('command', { commandId, payload })
  let config = normalizeConfig(await call('config.get'))
  render(config)
  enabled.disabled = false
  save.disabled = false
  root.querySelector('main')?.setAttribute('aria-busy', 'false')
  status.textContent = ''
  enabled.onchange = () => { config.enabled = enabled.checked; render(config) }
  save.onclick = async () => {
    save.disabled = true
    status.textContent = 'Saving…'
    try {
      config = normalizeConfig({ enabled: enabled.checked, seconds: Number(seconds.value) })
      config = normalizeConfig(await call('config.save', config))
      render(config)
      status.textContent = 'Card Timer settings saved.'
    } catch (error) { status.textContent = error instanceof Error ? error.message : 'Settings could not be saved.' }
    finally { save.disabled = false }
  }
}).catch((error) => { root.querySelector('main')?.setAttribute('aria-busy', 'false'); status.textContent = error instanceof Error ? error.message : 'Card Timer settings are unavailable.' })

