# NeoAnki Card Timer

A signed, isolated NeoAnki extension that shows an optional target timer while studying. Reaching zero never grades a card; the learner still reveals the answer and chooses a memory grade.

## Privacy and permissions

Card Timer has no network or content access. Its synchronized configuration stores only whether the timer is enabled and the selected duration. The settings and review controls run in sandboxed SDK 2 iframes.

Requested permissions:

- `config:sync` — save the enabled state and duration.
- `ui:settings` — render the settings panel.
- `ui:review` — render the countdown beside the active card.

## Development

Clone this repository beside `neoanki/neo-anki`, then run:

```sh
npm install
npm run typecheck
npm test
npm run check
npm run build
```

Production releases are reproducibly built from a protected Ed25519 signing key by GitHub Actions. No private signing key is stored in the repository.

