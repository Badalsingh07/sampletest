# Trading Demo Terminal

A self-contained Expo mobile prototype for exploring a dark trading-terminal interface. It uses only local sample values: no broker connection, market feed, account credentials, or network trading service is included.

## What is included

- A black, blue-accented quote board with simulated prices.
- Candlestick charts, timeframes, indicators, and symbol switching.
- A local sign-in and broker-selection demonstration.
- Sample positions, trade history, account summary, and report charts.
- Account, broker, messages, settings, and sidebar interface prototypes.

The demo account credentials are deliberately local to the UI:

```text
Login:    9009096389673
Password: Pass@1234
```

## Run locally

Install dependencies and launch Expo from the project folder:

```bash
npm ci
npm start
```

On Windows, use `npm.cmd` or `npx.cmd` if PowerShell blocks script shims.

## Project map

| Location | Description |
| --- | --- |
| `App.tsx` | App state, authentication session, and tab navigation |
| `src/screens/` | Individual terminal screens and local interaction flows |
| `assets/` | App artwork used by the prototype |
| `app.json` | Expo application configuration |

## Important

This repository is an interface demo only. Figures, positions, account balances, reports, brokers, and account forms are fictional UI data. Do not use it for financial decisions or as a production trading client.
