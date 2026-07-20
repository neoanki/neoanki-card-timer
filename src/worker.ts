import { defineExtension, exposeExtensionWorker } from '@neo-anki/extension-sdk'
import { normalizeConfig } from './config.js'

const extension = defineExtension({
  manifest: {
    format: 'neo-anki-extension', schemaVersion: 2, sdkVersion: 2,
    id: 'org.neoanki.card-timer', name: 'Card Timer', version: '2.0.0', publisher: 'NeoAnki contributors',
    publisherKey: 'MCowBQYDK2VwAyEADXRs0EgH8lw6h36O6fHOwU1JaXIsKnswhU2GMnZyNoA=',
    permissions: ['config:sync', 'ui:settings', 'ui:review'], workerEntry: 'dist/worker.js',
    uiEntries: [{ id: 'settings', surface: 'settings', entry: 'dist/settings.js' }, { id: 'review', surface: 'review', entry: 'dist/review.js' }],
    provenance: { sourceCommit: '0000000000000000000000000000000000000000', coreCommit: '23b063f75868a6c104eb5ed157fc44df9179b466', buildSystem: 'neo-anki-extension-cli' },
  },
  async handle(request, host) {
    if (request.type !== 'command') return { type: 'error', requestId: request.type === 'planning-signals' ? request.request.requestId : request.operationId, code: 'unsupported', message: 'Unsupported request.' }
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

