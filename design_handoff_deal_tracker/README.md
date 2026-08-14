# Handoff: Deal Tracker — mobile price tracking screen

## Overview

A mobile screen for tracking prices of products across online stores (currently Amazon and Apple TV). It does three jobs:

1. Rank tracked products by how good a deal they are right now (current price vs. their own 3-month average).
2. Label each product with a deal badge ("Lowest in 3 mo", "Well below avg", "Below avg", "At average", "Above avg").
3. Show the price trend — a sparkline on every row, and a full 3-month history with low/high markers when a row is tapped.

It replaces the existing Python/Dash dashboard in the `Product_Tracker` repo (dark header, three KPI cards, sorted deals table, one big Plotly price-history chart with a product dropdown).

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** using its established patterns and libraries. If no front-end environment exists yet (the current app is server-rendered Dash), choose the most appropriate approach for the project and implement the designs there.

Note on file format: the `.dc.html` files are self-contained HTML documents that use a small in-house runtime (`support.js`) — markup between `<x-dc>` tags, plus a logic class in the trailing `<script type="text/x-dc">`. Open them in a browser to see the design; read them for exact values. Do not port the runtime; port the design.

## Fidelity

**High-fidelity.** Colors, typography, spacing, radii, badge logic, sort/filter behavior and the expand interaction are all final. Recreate the UI pixel-accurately using the codebase's existing libraries. The product names, prices and price histories are **sample data** — wire to the real `product` / `price` tables.

## Screens / Views

### 1. Deal Tracker (mobile, primary screen)

File: `Deal Tracker mobile.dc.html`. Design frame: 390 × 844 (iPhone 14/15 logical size). Everything scrolls inside a single column; the header, sort bar and store filter are fixed (non-scrolling) at the top.

Frame chrome (prototype only — in the real app this is the viewport): `background #ffffff`, `border 1px solid #dcdcdc`, `border-radius 8px`, `overflow hidden`, `display flex; flex-direction: column`.

**a. Header** — an ink band (polarity flip): `flex: 0 0 auto`, `padding 20px`, `background #0b0b0d`, `color #ffffff`, no bottom hairline (the colour change is the divider), `display flex; flex-direction: column; gap 8px`. Three stacked lines:

- Wordmark: cart icon + "Deal Tracker", `display flex; align-items: center; gap 12px`. Title is Inter 600, 26px, `letter-spacing -0.5px`, `line-height 30px`, white. Icon is 30 × 30, outline only, `stroke currentColor` (so it inverts with the band), `fill none`, round caps: 4px stroke on the handle and basket, 3.5px on the wheels, 2.5px on the two basket dividers. Adapted from the existing app's mark — the green wheel hubs and horizontal basket rules were dropped, since the design system forbids chromatic color on icons.
- "Updated 06:15" — set as an eyebrow on its own line: Inter 550, 12px, `letter-spacing 0.6px`, `text-transform uppercase`, `#acacac`. Real value: timestamp of the most recent scrape.
- Summary line — Inter 400, 14px, `line-height 20px`, `#dcdcdc`, `margin 4px 0 0`. Generated: `"{dealCount} of {total} items are below their 3-month average. {bestName} is at its lowest price in 3 months."` where `bestName` is the best-deal product's name truncated at the first `:`.

**b. Sort bar** — `flex: 0 0 auto`, `padding 12px 16px`, `border-bottom 1px solid #dcdcdc`, `display flex; align-items: center; justify-content: space-between`.

- Left: a two-button segmented control, `display inline-flex`, `border 1px solid #dcdcdc`, `border-radius 4px`, `overflow hidden`. Buttons "Deal" and "Price": Inter 500, 14px, `padding 8px 14px`, no border (the second has `border-left 1px solid #dcdcdc`). Selected: `background #0b0b0d`, `color #ffffff`. Unselected: `background #ffffff`, `color #0b0b0d`. Default selection: **Deal**.
- Right: count label — Inter 550, 12px, `letter-spacing 0.6px`, `text-transform uppercase`, `#8a8a8a`. Reads `"{total} tracked"` with no store filter, `"{shown} of {total}"` when filtered.

**c. Store filter** — `flex: 0 0 auto`, `padding 10px 16px`, `border-bottom 1px solid #dcdcdc`, `display flex; gap 8px`, `overflow-x auto` with the scrollbar hidden (`::-webkit-scrollbar { width:0; height:0 }`).

- One button per store, plus a leading "All stores": Inter 500, 14px, `padding 8px 14px`, `border-radius 4px`, `white-space nowrap`, `border 1px solid`. Selected: `background #0b0b0d`, `color #fff`, `border-color #0b0b0d`. Unselected: `background #fff`, `color #0b0b0d`, `border-color #dcdcdc`.
- Store list is derived from the data, not hardcoded. Default: "All stores".

**d. Product list** — `flex: 1 1 auto`, `overflow-y auto`, `padding 12px`, `display flex; flex-direction: column; gap 10px`, `background #f7f7f8` (the one tinted surface; it separates the cards from the white chrome).

Each row is a card: `background #fff`, `border 1px solid #dcdcdc`, `border-radius 8px`, `padding 14px 16px`, `display flex; flex-direction: column; gap 12px`, `cursor pointer`. The whole card is the tap target for expand/collapse.

Collapsed card contents — one flex row, `align-items flex-start; gap 12px`:

- Left column (`flex 1; min-width 0; display flex; flex-direction: column; gap 6px`):
  - Product name — Inter 500, 14px, `line-height 20px`, `letter-spacing -0.1px`, `#0b0b0d`. Wraps to multiple lines; do not truncate.
  - Meta row (`display flex; align-items: center; gap 8px`): store name — Inter 550, 12px, `#8a8a8a` — then the deal **Badge** (see Components).
- Right column (`flex 0 0 auto; display flex; flex-direction: column; align-items: flex-end; gap 6px`):
  - Current price — Inter 600, 18px, `letter-spacing -0.2px`, `font-variant-numeric tabular-nums`, `#0b0b0d`.
  - Sparkline — inline SVG, 88 × 26, `viewBox "0 0 88 26"`. Polyline of the full history, `stroke #0b0b0d`, `stroke-width 1.5`, `fill none`; a `r=2.5` `#0b0b0d` dot on the last point. Scaled to the series' own min/max with 4px vertical padding. No axes, no fill.

Expanded card adds a block below, `border-top 1px solid #dcdcdc`, `padding-top 14px`, `display flex; flex-direction: column; gap 14px`:

  1. **History chart** — inline SVG, 326 × 110, `viewBox "0 0 326 110"`, `overflow visible`, 8px vertical padding.
     - 3-month average: horizontal line, `stroke #dcdcdc`, `stroke-width 1`, `stroke-dasharray "3 3"`, clamped into the min/max range.
     - Series: polyline, `stroke #0b0b0d`, `stroke-width 1.5`, `fill none`.
     - Markers: high `r=3.5` `#acacac`; low `r=3.5` `#12c94a`; current (last point) `r=4` `#0b0b0d`. Draw in that order so current sits on top.
  2. **Legend** — `display flex; gap 16px; flex-wrap: wrap`. Two items, each `display inline-flex; align-items: center; gap 6px`, Inter 550, 12px, `#3a3a3a`, `white-space nowrap`, preceded by a 7px dot (`border-radius 9999px`): green `#12c94a` "Low $X · {date}", grey `#acacac` "High $X · {date}".
  3. **Stat row** — `display flex; justify-content: space-between`. Three stacked pairs (`gap 2px`): label Inter 550, 12px, `letter-spacing 0.6px`, uppercase, `#8a8a8a`; value Inter 500, 14px, `tabular-nums`. Labels/values: "3-mo avg" → `$X`; "vs avg" → signed percent; "Changed" → relative time since last price change ("2 days ago").
  4. **CTA** — full-width primary Button, 44px tall. Label is store-specific: "Buy on Amazon" / "View on Apple TV". Links out to the product URL.

### 2. Current Dash app (reference only)

File: `Deal Tracker (current).dc.html` — a faithful recreation of today's desktop dashboard, included so you can see what is being replaced and which data the redesign already covers. Not a target.

## Interactions & Behavior

- **Tap a card** → toggles its expanded detail panel. Accordion: only one card is expanded at a time; expanding another collapses the previous. On first load the top-ranked (best deal) card is expanded.
- **Sort "Deal"** → ascending by `vs 3-mo average` (most negative, i.e. best deal, first). This is the default.
- **Sort "Price"** → ascending by current price.
- **Store filter** → filters the list to one store; "All stores" clears it. Changing the store collapses any expanded card and updates the count label. Sort selection persists across filter changes.
- Header summary and the count label are always computed over the **full** tracked set (they don't change with the store filter), except the count label's `"{shown} of {total}"` form.
- **Hover** (desktop/pointer): unselected sort and filter buttons tint to `#f5f5f5`; primary buttons darken `#0b0b0d` → `#242424`. 180ms `cubic-bezier(.4,0,.2,1)`. No hover on cards (touch-first).
- **No animations** on expand/collapse in the prototype. If you add one, keep it to a 280ms height/opacity transition on the same easing — the design system forbids bounce or spring.
- **Empty state**: not designed. If a store filter yields nothing, follow the design system's `EmptyState` component with copy naming the next action.
- **Responsive**: designed at 390px wide; the layout is a single column and stretches cleanly. The 326-wide history SVG should scale with `max-width: 100%`. On wide viewports, cap the column around 480px rather than letting cards stretch.
- **Accessibility**: cards should be buttons (or have `role="button"` + `aria-expanded`); the sort control is a radio group; badge text must not be the only carrier of meaning (the percentage in the detail panel repeats it). Minimum tap target 44px — the cards and CTA meet this; the 14px-text filter buttons are 34px tall, so pad them to 44px in the real build.

## State Management

Client state (all trivial, no server round-trip):

| State | Type | Default | Set by |
|---|---|---|---|
| `openRow` | product id \| null | best-deal product | tapping a card |
| `sort` | `"deal"` \| `"price"` | `"deal"` | sort control |
| `store` | store name \| `"All"` | `"All"` | store filter |

Derived per product (computed, not stored):

- `price` = latest price in history
- `avg` = mean of the 3-month history
- `vs` = `(price - avg) / avg`, formatted as a signed percent to 1 decimal
- `low` / `high` = min / max of the history, with their dates
- `badge` / `tone`, by first match:
  - `price <= low` → "Lowest in 3 mo", tone `success`, **solid** badge
  - `vs <= -threshold` → "Well below avg", tone `info`, soft
  - `vs < -0.01` → "Below avg", tone `neutral`, soft
  - `vs <= 0.01` → "At average", tone `neutral`, soft
  - otherwise → "Above avg", tone `neutral`, soft
  - `threshold` is a configurable "what counts as a deal" percentage; the prototype exposes it as a control, currently **10%**. Make it a constant or a user setting.
- Header `dealCount` = products whose tone is `success` or `info`.

Data fetching: one request returning, per tracked product, `{ id, name, store, url, lastChangedAt, history: [{ date, price }] }` over a 3-month window. Everything above is computed client-side from that. The existing repo already stores this — see `dash_app.py` and the `product` / `price` tables.

## Design Tokens

From the Peppy Design System (bundled under `_ds/`; tokens in `_ds/*/tokens/*.css`). Use those variables rather than the literals below where the codebase already loads them.

Colors

| Role | Value |
|---|---|
| Primary / ink | `#0b0b0d` |
| Primary hover | `#242424` |
| Body text | `#3a3a3a` |
| Muted text | `#8a8a8a` |
| Faint text / high marker / header eyebrow | `#acacac` |
| Canvas | `#ffffff` |
| List surface | `#f7f7f8` |
| Page surround (prototype only) | `#f4f4f5` |
| Hairline / header summary text | `#dcdcdc` |
| Secondary hover tint | `#f5f5f5` |
| Success / low marker | `#12c94a` |
| Info | `#1668f0` |

No gradients, no shadows on these cards (Level 1: white + hairline + 8px radius). Chromatic accents (purple/pink/blue/orange/green fills) are for marketing category cards only — not used here.

Typography — Inter throughout. 600 for the title and prices, 550 for uppercase labels and 12px meta, 500 for names and buttons, 400 for body. Never 700+. Sizes used: 26 / 18 / 16 / 14 / 12. Negative tracking on display and body (-0.5px @26px, -0.2px @18px, -0.16px @16px, -0.1px @14px); +0.6px on 12px uppercase labels. `font-variant-numeric: tabular-nums` on every price and percentage.

Spacing — 4px base: 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 20. Card padding 14px 16px; list padding 12px with 10px gaps; header 20px all round.

Radius — 4px buttons and badges (never pill CTAs), 8px cards, 9999px only for the legend dots.

Motion — 120ms hover fills, 180ms color/border, 280ms larger transitions, all `cubic-bezier(.4,0,.2,1)`.

## Screenshots

In `screenshots/` (2x, captured from the prototype at 390 × 844):

- `01-list-with-row-expanded.png` — default state (ink-band header): sorted by deal, all stores, top row expanded showing the full history chart, legend, stat row and CTA.
- `02-list-collapsed.png` — all rows collapsed.
- `03-store-filter-amazon.png` — filtered to Amazon; note the count label switching to "5 of 8".

The sample data is weighted toward falling prices, so most rows show the solid "Lowest in 3 mo" badge. With real data expect a mix — the full badge ladder is specified under **State Management**.

## Assets

- No images, photography or illustration. The design system ships none and none were invented.
- `assets/cart-icon.svg` — the existing Dash app's cart mark, copied from `Product_Tracker/assets/`. Used in the "current app" reference recreation only; the redesign uses type alone.
- Cart wordmark icon: inline SVG in the header of `Deal Tracker mobile.dc.html`, redrawn from `Product_Tracker/assets/cart-icon.svg`. Copy the inline markup; no file needed. If you add other icons, the design system substitutes **Lucide** (outline only, 16px inline / 20px card headers). No emoji.
- Fonts: Inter (and Inconsolata for mono) loaded from Google Fonts via `_ds/*/tokens/fonts.css`. Confirm whether the brand's licensed cuts differ. Inter's variable axis is required for the 550 weight.

## Files

- `Deal Tracker mobile.dc.html` — the design to build. Exact values, badge logic and chart math all live here (logic class at the bottom of the file).
- `Deal Tracker (current).dc.html` — recreation of today's Dash dashboard, for comparison.
- `support.js` — the prototype runtime the two files above need in order to render. Do not port it.
- `_ds/` — the Peppy Design System bundle: `tokens/*.css` (colors, type, spacing, radius, elevation, fonts), `styles.css`, and `_ds_bundle.js` with the React primitives used here (`Button`, `Badge`).
- `screenshots/` — the three states above.
- Source of truth for data: the `Product_Tracker` repo — `dash_app.py` (current queries and KPI definitions), `update_amazon_product_list.py` / `update_appletv_product_price.py` (scrapers, store names).
