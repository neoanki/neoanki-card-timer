import { defineExtension, exposeExtensionWorker } from '@neo-anki/extension-sdk'
import { normalizeConfig } from './config.js'

const requestIdOf = (request: unknown) => {
  const value = request as { requestId?: string; operationId?: string; request?: { requestId?: string } }
  return value.request?.requestId || value.operationId || value.requestId || 'unsupported'
}

const extension = defineExtension({
  manifest: {
    format: 'neo-anki-extension', schemaVersion: 2, sdkVersion: 2,
    id: 'org.neoanki.card-timer', name: 'Card Timer', version: '2.0.3', minimumNeoAnkiVersion: '0.4.0', publisher: 'NeoAnki contributors',
    publisherKey: 'MCowBQYDK2VwAyEADXRs0EgH8lw6h36O6fHOwU1JaXIsKnswhU2GMnZyNoA=',
    permissions: ['config:sync', 'ui:settings', 'ui:review'], workerEntry: 'dist/worker.js',
    uiEntries: [{ id: 'settings', surface: 'settings', entry: 'dist/settings.js', label: 'Card Timer', description: 'Set review pacing and countdown behavior.', icon: 'timer', launchDestination: 'extensions/configure' }, { id: 'review', surface: 'review', entry: 'dist/review.js', label: 'Review timer', description: 'Show the configured pacing target during review.', icon: 'timer', launchDestination: 'review' }],
    provenance: { sourceCommit: '0000000000000000000000000000000000000000', coreCommit: '7ad6541f1e4a15553d6ffd31c70708ae193691fe', buildSystem: 'neo-anki-extension-cli' },
  },
  async handle(request, host) {
    if (request.type !== 'command') return { type: 'error', requestId: requestIdOf(request), code: 'unsupported', message: 'Card Timer cannot handle this request.' }
    if (request.commandId === 'config.get') return { type: 'result', requestId: request.requestId, value: normalizeConfig(await host.config.read()) }
    if (request.commandId === 'config.save') {
      const config = normalizeConfig(request.payload)
      await host.config.write(config)
      return { type: 'result', requestId: request.requestId, value: config }
    }
    return { type: 'error', requestId: request.requestId, code: 'unsupported', message: 'Unknown Card Timer command.' }
  },
})

exposeExtensionWorker(extension)
