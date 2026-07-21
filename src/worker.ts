import { defineExtension, exposeExtensionWorker } from '@neo-anki/extension-sdk'
import { normalizeConfig } from './config.js'

const requestIdOf = (request: unknown) => {
  const value = request as { requestId?: string; operationId?: string; request?: { requestId?: string } }
  return value.request?.requestId || value.operationId || value.requestId || 'unsupported'
}

const extension = defineExtension({
  manifest: {
    format: 'neo-anki-extension', schemaVersion: 2, sdkVersion: 2,
    id: 'org.neoanki.card-timer', name: 'Card Timer', version: '2.1.0', minimumNeoAnkiVersion: '0.5.0', publisher: 'NeoAnki contributors',
    publisherKey: 'MCowBQYDK2VwAyEADXRs0EgH8lw6h36O6fHOwU1JaXIsKnswhU2GMnZyNoA=',
    permissions: ['config:sync', 'ui:review'], workerEntry: 'dist/worker.js',
    uiEntries: [{ id: 'review', surface: 'review', entry: 'dist/review.js', label: 'Review timer', description: 'Show the configured pacing target during review.', icon: 'timer', launchDestination: 'review' }],
    settings: { schemaVersion: 1, label: 'Card Timer', description: 'Set review pacing and countdown behavior.', helpText: 'When time runs out, the card stays open until you reveal and grade it.', icon: 'timer', sections: [{ id: 'pacing', title: 'Review pacing', controls: [{ id: 'enabled', kind: 'toggle', path: '/enabled', label: 'Enable Card Timer', description: 'Show a countdown target beside each review card.', defaultValue: false }, { id: 'seconds', kind: 'number', path: '/seconds', label: 'Seconds per card', description: 'Choose a target from 5 seconds to 5 minutes.', defaultValue: 20, min: 5, max: 300, step: 5, requiredWhen: { path: '/enabled', operator: 'truthy' }, enabledWhen: { path: '/enabled', operator: 'truthy' } }] }] },
    provenance: { sourceCommit: '0000000000000000000000000000000000000000', coreCommit: 'ccb655a4ea882ffebb40f4b08267e15a34cc93e7', buildSystem: 'neo-anki-extension-cli' },
  },
  async handle(request, host) {
    if (request.type !== 'command') return { type: 'error', requestId: requestIdOf(request), code: 'unsupported', message: 'Card Timer cannot handle this request.' }
    if (request.commandId === 'config.get') return { type: 'result', requestId: request.requestId, value: normalizeConfig(await host.config.read()) }
    return { type: 'error', requestId: request.requestId, code: 'unsupported', message: 'Unknown Card Timer command.' }
  },
})

exposeExtensionWorker(extension)
