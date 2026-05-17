# Olympic Paints — PULSE v2

Mobile-first sales dashboard for Olympic Paints reps. Reads JSON snapshots written daily by the PULSE v2 Python pipeline at `1.Projects/PULSE v2 — Sales & Ops Manager/`.

## Routes

- `/` — Index page (link to each rep)
- `/today/[rep]` — Today's planned stores (status + debtors snapshot per store)
- `/week/[rep]` — Full 5-day plan
- `/recovery/[rep]` — Recovery accounts (worst-first)
- `/today/[rep]/store/[accno]` — Per-store deep-dive with full last-invoice line items

## Data contract

Snapshots live in `public/data/<rep>/`:

- `today.json` — today's planned stores
- `week.json` — 5-day plan
- `recovery.json` — recovery accounts
- `store-<accno>.json` — per-store detail with last invoice

Snapshots are committed by `python -m pulse publish-web` running on the PULSE v2 box at 09:00 weekdays. Vercel auto-deploys on push.

## Dev

```bash
npm install
npm run dev   # http://localhost:3000
```

## Design system

Same as the Olympic Paints house style: Barlow Condensed (display) + Barlow (body), navy theme by default, yellow accent (#F5C400), token-based via CSS variables.
