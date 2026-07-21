# Card Timer

Keep review sessions moving with a visible countdown target for each card. When time runs out, Card Timer gives a gentle notification and keeps the card open so you can reveal the answer and grade it yourself.

## Features

- Choose a target from 5 seconds to 5 minutes per card.
- See the remaining time and progress beside the card while studying.
- Hear a screen-reader announcement at five seconds and when the target ends.
- Pause normal grading decisions until you are ready; the timer never reveals or grades a card.

## Install

Download the `.neoanki-extension` file from the latest release, then open **Extensions → Browse → Install from file** in Neo Anki.

## Privacy and permissions

Card Timer does not read your notes or connect to the internet. It synchronizes only the on/off setting and selected duration.

Requested permissions:

- `config:sync` — save the enabled state and duration.
- `ui:review` — render the countdown beside the active card.

Settings are declared as inert manifest data and rendered by Neo Anki. Card Timer does not ship settings-page code.

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
