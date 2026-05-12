# Fluid

Fluid is a Chrome Extension that reshapes Gmail with preset layouts and a drag-and-drop panel editor. It stores layouts locally in `chrome.storage.local`, so changes persist without a backend or account system.

## Install

1. Open Chrome and go to `chrome://extensions`.
2. Enable Developer mode.
3. Choose "Load unpacked" and select this repository folder.
4. Open Gmail at `https://mail.google.com`.

## Test

```bash
npm test
```

The project is plain Manifest V3 JavaScript with no build step.

## Known Limitations

- Gmail DOM selectors can change; Fluid uses fallback selector chains and fails silently when a panel is unavailable.
- v1 supports Gmail only.
- Layouts are stored locally per Gmail account URL and do not sync across devices.
