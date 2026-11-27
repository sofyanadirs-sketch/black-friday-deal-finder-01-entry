# DealHound — Black Friday 2026 deal finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/sofyanadirs-sketch/black-friday-deal-finder-01-entry/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/sofyanadirs-sketch/black-friday-deal-finder-01-entry/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A static site of 44 real Black Friday 2026 deals, each price checked on
27 Nov 2026 (13:35 WIB) from a deals source that names the store. Every deal
shows its product, store, store link, sale price, usual price, discount,
check time and source — plus an honest verdict (NEW LOW / REAL DEAL / STRONG
DEAL / GOOD DEAL / ROUTINE SALE) with the evidence behind it.

## What it does

- Search + filters by category, store and minimum discount, with sorting
  (best deal first, biggest $ saved, biggest % off, lowest price, A–Z) and a
  new-lows-only toggle.
- Deal score (0–100) from discount, dollars saved and record-low status.
- Compare view: the same product at every store that sells it
  (AirPods Pro 3 at 4 stores, Beats Studio Pro, Insignia F50, LG C6 OLED,
  iPad A16, Switch 2 bundle), cheapest row marked.
- Deal detail pages with the full price breakdown and the source.
- Bright, dense layout that works on desktop and on a phone. No network
  requests: all data, styles and scripts are files under `app/`.

## Files

- `app/index.html` — the shell
- `app/data.js` — the 44 verified deals
- `app/filters.js` — discount, verdict, score, filter and sort
- `app/views.js` — HTML for the board, deal pages and compare pages
- `app/main.js` — hash router (`#/`, `#/deal/<id>`, `#/compare/<group>`)
- `app/style.css` — the look
- `main.ts` — the hand-in program: copies `app/` + `screenshots/` to the
  output directory and writes `dossier.json` with the vendored library
- `serve.ts` — local static server (`node serve.ts`, then
  http://localhost:8080)

## How the deals were checked

Each price was read on 27 Nov 2026 from a deals roundup or store page that
names the store: RedmondPie, BuzzFeed, Walmart.com, YayaNews, Montgomery
Daily News, TrendThread, Mashable, DealNews and Topsave. Every card shows
its source and check time. A deal is labelled NEW LOW only when its source
calls the price a record low. Prices move during Black Friday — the site
tells shoppers to confirm at checkout.

## Entry

Built for make.fun bounty `black-friday-deal-finder-01`
("Build the best real Black Friday deal finder", $250, 20 paid places,
deadline 29 Nov 2026 07:42 WIB). Entry by @sofyan-adi.
