# Project notes for contributors

This project is an Expo and React Native prototype. Favor responsive mobile layouts, accessible touch targets, and Android/iOS-compatible components.

## Working rules

- Check the installed Expo SDK version in `package.json` before using or changing Expo APIs.
- Use the matching official Expo documentation when an Expo API, configuration key, or build capability is involved.
- Keep all financial, broker, and account examples explicitly local and simulated.
- Do not add real credentials, API keys, brokerage integrations, or private user data.
- Maintain the dark terminal visual language across new screens and dialogs.

## Validation

Run these checks after a code change:

```bash
npx expo lint
npx tsc --noEmit
```

If PowerShell blocks the script shim, use `npx.cmd` instead. If the repository later uses Bun, use `bunx` for equivalent commands.

## Native projects

The project currently relies on Expo configuration. Do not manually create or modify generated Android or iOS files; use Expo configuration and supported config plugins when native behavior is needed.
