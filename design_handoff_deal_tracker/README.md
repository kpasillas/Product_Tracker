# Handoff: Deal Tracker — responsive price tracking screen

## Overview

A responsive screen for tracking prices of products across online stores (currently Amazon and Apple TV) — one design that serves phones and desktop browsers. It does three jobs:

1. Rank tracked products by how good a deal they are right now (current price vs. their own 3-month average).
2. Label each product with a deal badge ("Lowest in 3 mo", "Well below avg", "Below avg", "At average", "Above avg").
3. Show the price trend — a sparkline on every row, and a full 3-month history with low/high markers: in a persistent side pane on desktop, in an expanding panel on mobile.

It replaces the existing Python/Dash dashboard in the `Product_Tracker` repo (dark header, three KPI cards, sorted deals table, one big Plotly price-history chart with a product dropdown).

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** using its established patterns and libraries. If no front-end environment exists yet (the current app is server-rendered Dash), choose the most appropriate approach for the project and implement the designs there.

Note on file format: the `.dc.html` files are self-contained HTML documents that use a small in-house runtime (`support.js`) — markup between `<x-dc>` tags, plus a logic class in the trailing `<script type="text/x-dc">`. Open them in a browser to see the design; read them for exact values. Do not port the runtime; port the design.

## Fidelity

**High-fidelity.** Colors, typography, spacing, radii, badge logic, sort/filter behavior, the 900px breakpoint and both the desktop selection and mobile expand interactions are all final. Recreate the UI pixel-accurately using the codebase's existing libraries. The product names, prices and price histories are **sample data** — wire to the real `product` / `price` tables.

## Screens / Views

### 1. Deal Tracker (responsive, primary screen)

File: `Deal Tracker mobile.dc.html`. One responsive design, not two screens. The breakpoint is **900px** (exposed as a control in the prototype, 720–1200): at or above it the layout is master-detail; below it, the single-column list with tap-to-expand detail.

Page shell: `min-height 100vh`, `background #ffffff`, `display flex; flex-direction: column`.

**a. Sticky header block** — the ink bar and the sort/filter row are wrapped in one element: `position sticky; top 0; z-index 20`, `background #ffffff`, `flex 0 0 auto`. It stays pinned while the list scrolls, at every width.

**a1. Ink bar** — full-bleed `background #0b0b0d`, `color #ffffff`, edge-to-edge; content constrained to `max-width 1280px; margin 0 auto` with `padding clamp(20px, 2.4vw, 28px) clamp(16px, 4vw, 32px)`. Inner layout `display flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap 16px` — so at desktop the summary sits to the right of the wordmark, and at mobile it wraps under it.

- Wordmark: cart icon + "Deal Tracker", `display flex; align-items: center; gap 12px`. Title is Inter 600, `clamp(26px, 2.4vw, 32px)`, `letter-spacing -0.5px`, `line-height 1.15`, white. Icon is 30 × 30, outline only, `stroke currentColor` (so it inverts with the band), `fill none`, round caps: 4px stroke on the handle and basket, 3.5px on the wheels, 2.5px on the two basket dividers. Adapted from the existing app's mark — the green wheel hubs and horizontal basket rules were dropped, since the design system forbids chromatic color on icons.
- Timestamp eyebrow, own line under the wordmark: Inter 550, 12px, `letter-spacing 0.6px`, `text-transform uppercase`, `#acacac`. Copy is date-relative, from the scrape timestamp: **"Updated today at 06:15"**, "Updated yesterday at 06:15", else "Updated 13 Aug at 06:15" (day, abbreviated month, 24-hour time).
- Summary line — Inter 400, 14px, `line-height 20px`, `#dcdcdc`, `max-width 52ch`. Generated: `"{dealCount} of {total} items are below their 3-month average. {bestName} is at its lowest price in 3 months."` where `bestName` is the best-deal product's name truncated at the first `:`.

**a2. Sort + filter row** — `background #ffffff`, `border-bottom 1px solid #dcdcdc`; inner container `max-width 1280px; margin 0 auto`, `padding 12px clamp(16px, 4vw, 32px)`, `display flex; flex-wrap: wrap; align-items: center; gap 12px`. Three parts on one line (wrapping at narrow widths):

- Sort — two-button segmented control, `display inline-flex`, `border 1px solid #dcdcdc`, `border-radius 4px`, `overflow hidden`. Buttons "Deal" and "Price": Inter 500, 14px, `padding 8px 14px`, no border (the second has `border-left 1px solid #dcdcdc`). Selected: `background #0b0b0d`, `color #ffffff`. Unselected: `background #ffffff`, `color #0b0b0d`. Default: **Deal** (prototype control can set Price).
- Store filter — `display flex; gap 8px`, `flex 1 1 auto`, `overflow-x auto` with the scrollbar hidden (`::-webkit-scrollbar { width:0; height:0 }`). One button per store plus a leading "All stores": Inter 500, 14px, `padding 8px 14px`, `border-radius 4px`, `white-space nowrap`, `border 1px solid`. Selected: `background #0b0b0d`, `color #fff`, `border-color #0b0b0d`. Unselected: `background #fff`, `color #0b0b0d`, `border-color #dcdcdc`. Store list is derived from the data, not hardcoded. Default: "All stores".
- Count label — Inter 550, 12px, `letter-spacing 0.6px`, uppercase, `#8a8a8a`. Reads `"{total} tracked"` unfiltered, `"{shown} of {total}"` when filtered.

**b. Desktop content (≥ 900px) — master-detail.** Container `max-width 1280px; margin 0 auto`, `padding 24px clamp(16px, 4vw, 32px) 48px`, `display grid`, `grid-template-columns minmax(0, 1fr) minmax(0, 1.15fr)`, `gap 32px`, `align-items start`.

- **Left: the list.** `display flex; flex-direction: column; gap 10px`. Each row is a card: `background #fff`, `border 1px solid #dcdcdc`, `border-radius 8px`, `padding 14px 16px`, `display flex; align-items: flex-start; gap 16px`, `cursor pointer`, `transition background 180ms / border-color 180ms cubic-bezier(.4,0,.2,1)`. Hover tints `#f7f7f8`. **Selected row**: `background #f7f7f8`, `border-color #0b0b0d` and a `border-left 2px solid #0b0b0d` indicator (the design system's active-row treatment). Rows never expand at this width — selection drives the pane.
  - Left column (`flex 1 1 auto; min-width 0; gap 6px`): product name — Inter 500, 14px, `line-height 20px`, `letter-spacing -0.1px`; meta row (`gap 8px`, wraps): store name Inter 550, 12px, `#8a8a8a`, then the deal **Badge**.
  - Right column (`flex 0 0 auto; align-items: flex-end; gap 6px`): current price — Inter 600, 18px, `letter-spacing -0.2px`, tabular-nums; sparkline — inline SVG 88 × 26, `viewBox "0 0 88 26"`, polyline `stroke #0b0b0d`, `stroke-width 1.5`, `fill none`, `r=2.5` `#0b0b0d` dot on the last point, scaled to the series' own min/max with 4px vertical padding.
- **Right: the detail pane.** `position sticky` with `top = sticky header height + 24px` (measured at runtime, so it never slides under the pinned header). Card: `background #ffffff`, `border 1px solid #dcdcdc`, `border-radius 8px`, `padding 32px`, `display flex; flex-direction: column; gap 24px`. Contents top to bottom:
  1. **Head row** — `display flex; align-items: flex-start; justify-content: space-between; gap 24px; flex-wrap: wrap`. Left stack (`gap 8px`): store name as an uppercase eyebrow (Inter 550, 12px, +0.6px, `#8a8a8a`); product name Inter 600, 22px, `letter-spacing -0.3px`, `line-height 28px`; the deal Badge. Right: current price Inter 600, 32px, `letter-spacing -0.5px`, tabular-nums.
  2. **History chart** — inline SVG, `viewBox "0 0 560 220"`, `preserveAspectRatio none`, `width 100%`, `height 220px`, `overflow visible`, 14px vertical padding. 3-month average: horizontal line `stroke #dcdcdc`, `stroke-width 1`, `stroke-dasharray "4 4"`, clamped into the min/max range. Series: polyline `stroke #0b0b0d`, `stroke-width 1.5`, `fill none`, `vector-effect non-scaling-stroke` (the viewBox stretches horizontally). Markers: high `r=4` `#acacac`; low `r=4` `#12c94a`; current `r=4.5` `#0b0b0d`, drawn last so it sits on top.
  3. **Legend** — `display flex; gap 24px; flex-wrap: wrap`, each item `inline-flex; align-items: center; gap 6px`, Inter 550, 12px, `#3a3a3a`, `white-space nowrap`: green 7px dot "Low $X · {date}", grey 7px dot "High $X · {date}", and a 12 × 1px `#dcdcdc` rule for "3-month average".
  4. **Stat row** — `border-top 1px solid #dcdcdc`, `padding-top 20px`, `display grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap 16px`. Each pair: label Inter 550, 12px, uppercase, `#8a8a8a`; value Inter 500, 16px, tabular-nums. "3-mo avg" → `$X`; "vs avg" → signed percent; "Changed" → relative time since the last price change.
  5. **CTA** — primary Button, 44px tall, auto width (not full-width at this size). Label is store-specific: "Buy on Amazon" / "View on Apple TV". Links out to the product URL.
- **No selection** (store filter yields nothing): the pane becomes a plain Level-1 card, `padding 32px`, with "No items match this store." (Inter 500, 16px) and "Choose another store to see its tracked prices." (Inter 400, 14px, `#3a3a3a`).

**c. Mobile content (< 900px) — single column, tap to expand.** `padding 12px clamp(12px, 4vw, 16px) 32px`, `display flex; flex-direction: column; gap 10px`, `background #f7f7f8` (the one tinted surface; it separates the cards from the white chrome). Cards stretch full width.

Collapsed card: `background #fff`, `border 1px solid #dcdcdc`, `border-radius 8px`, `padding 14px 16px`, `display flex; flex-direction: column; gap 12px`, `cursor pointer`. Same two-column contents as the desktop row (name + store + badge on the left; price + sparkline on the right). The whole card is the tap target.

Expanded card adds a block below, `border-top 1px solid #dcdcdc`, `padding-top 14px`, `display flex; flex-direction: column; gap 14px`:

  1. **History chart** — inline SVG, `viewBox "0 0 326 110"`, `preserveAspectRatio none`, `width 100%`, `height 110px`, `overflow visible`, 8px vertical padding, `stroke-dasharray "3 3"` on the average line, `vector-effect non-scaling-stroke` on the series. Markers: high `r=3.5` `#acacac`; low `r=3.5` `#12c94a`; current `r=4` `#0b0b0d`.
  2. **Legend** — as desktop but `gap 16px` and without the average rule item.
  3. **Stat row** — `display flex; justify-content: space-between`; label as above, value Inter 500, 14px.
  4. **CTA** — full-width primary Button, 44px tall.

### 2. Current Dash app (reference only)

File: `Deal Tracker (current).dc.html` — a faithful recreation of today's desktop dashboard, included so you can see what is being replaced and which data the redesign already covers. Not a target.

## Interactions & Behavior

- **Sticky header**: the ink bar and the sort/filter row are pinned to the top of the viewport at every width; only the list (and, on desktop, the pane) scrolls. The desktop pane is itself sticky, offset by the measured header height + 24px.
- **Desktop (≥ 900px): click a row** → selects it and loads it into the detail pane. Exactly one row is always selected; on first load and after any sort or filter change it is the first row of the current list. Rows do not expand at this width.
- **Mobile (< 900px): tap a card** → toggles its expanded detail panel. Accordion: only one card is expanded at a time; expanding another collapses the previous. On first load the top-ranked (best deal) card is expanded.
- **Crossing the breakpoint** re-renders into the other mode; sort and store filter persist, and each mode keeps its own notion of the active row (selected vs. expanded).
- **Sort "Deal"** → ascending by `vs 3-mo average` (most negative, i.e. best deal, first). This is the default.
- **Sort "Price"** → ascending by current price.
- **Store filter** → filters the list to one store; "All stores" clears it. Changing the store collapses any expanded card and updates the count label. Sort selection persists across filter changes.
- Header summary and the count label are always computed over the **full** tracked set (they don't change with the store filter), except the count label's `"{shown} of {total}"` form.
- **Hover** (desktop/pointer): unselected sort and filter buttons tint to `#f5f5f5`; desktop list rows tint to `#f7f7f8`; primary buttons darken `#0b0b0d` → `#242424`. 180ms `cubic-bezier(.4,0,.2,1)`. No hover treatment on mobile cards.
- **No animations** on expand/collapse in the prototype. If you add one, keep it to a 280ms height/opacity transition on the same easing — the design system forbids bounce or spring.
- **Empty state**: on desktop the detail pane carries the "No items match this store." card (above). On mobile the list is simply empty — if you want a state there, use the design system's `EmptyState` component with the same copy.
- **Responsive**: one design, breakpoint 900px. Gutters and the title size use `clamp()` rather than steps (`clamp(16px, 4vw, 32px)` horizontal, `clamp(26px, 2.4vw, 32px)` title), so there is nothing to tune between 390px and 1280px. Content caps at a 1280px container. Both history SVGs stretch to 100% width with `preserveAspectRatio="none"` and non-scaling strokes. The prototype switches mode off `window.innerWidth`; in the real build prefer a CSS media query for layout and reserve JS for the selection-vs-expand behavior.
- **Accessibility**: mobile cards should be buttons (or have `role="button"` + `aria-expanded`); desktop rows are a single-select list (`role="listbox"`/`option`, or buttons with `aria-current`) and should support arrow-key movement between rows; the sort control is a radio group; badge text must not be the only carrier of meaning (the percentage in the detail panel repeats it). Minimum tap target 44px — the cards and CTA meet this; the 14px-text filter buttons are 34px tall, so pad them to 44px in the real build.

## State Management

Client state (all trivial, no server round-trip):

| State | Type | Default | Set by |
|---|---|---|---|
| `openRow` | product id \| null | best-deal product | tapping a card (mobile) |
| `selected` | product id \| null | first row of the current list | clicking a row (desktop) |
| `sort` | `"deal"` \| `"price"` | `"deal"` | sort control |
| `store` | store name \| `"All"` | `"All"` | store filter |
| `viewportWidth` | number | `window.innerWidth` | resize listener (prototype only — use a media query in the real build) |

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

Typography — Inter throughout. 600 for the title, prices and the pane's product name, 550 for uppercase labels and 12px meta, 500 for names and buttons, 400 for body. Never 700+. Sizes used: 32 / 26–32 (title, clamped) / 22 / 18 / 16 / 14 / 12. Negative tracking on display and body (-0.5px @26–32px, -0.3px @22px, -0.2px @18px, -0.16px @16px, -0.1px @14px); +0.6px on 12px uppercase labels. `font-variant-numeric: tabular-nums` on every price and percentage.

Spacing — 4px base: 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 32. Row card padding 14px 16px; detail pane padding 32px; list gaps 10px; grid gap 32px; horizontal gutters `clamp(16px, 4vw, 32px)`; ink bar vertical `clamp(20px, 2.4vw, 28px)`. Container max-width 1280px.

Radius — 4px buttons and badges (never pill CTAs), 8px cards, 9999px only for the legend dots.

Motion — 120ms hover fills, 180ms color/border, 280ms larger transitions, all `cubic-bezier(.4,0,.2,1)`.

## Screenshots

In `screenshots/` (2x, captured from the prototype):

- `01-desktop-master-detail.png` — desktop default: sorted by deal, all stores, first row selected and loaded into the pane.
- `02-desktop-filtered-amazon.png` — desktop filtered to Amazon; note the count label switching to "5 of 8" and the selection moving to the new first row.
- `03-mobile-list-expanded.png` — mobile default: single column, top row expanded showing the history chart, legend, stat row and full-width CTA.
- `04-mobile-list-collapsed.png` — mobile, all rows collapsed.

The sample data is weighted toward falling prices, so most rows show the solid "Lowest in 3 mo" badge. With real data expect a mix — the full badge ladder is specified under **State Management**.

## Assets

- No images, photography or illustration. The design system ships none and none were invented.
- `assets/cart-icon.svg` — the existing Dash app's cart mark, copied from `Product_Tracker/assets/`. Used in the "current app" reference recreation only; the redesign uses type alone.
- Cart wordmark icon: inline SVG in the header of `Deal Tracker mobile.dc.html`, redrawn from `Product_Tracker/assets/cart-icon.svg`. Copy the inline markup; no file needed. If you add other icons, the design system substitutes **Lucide** (outline only, 16px inline / 20px card headers). No emoji.
- Fonts: Inter (and Inconsolata for mono) loaded from Google Fonts via `_ds/*/tokens/fonts.css`. Confirm whether the brand's licensed cuts differ. Inter's variable axis is required for the 550 weight.

## Files

- `Deal Tracker mobile.dc.html` — the design to build (filename kept from the mobile-only phase; it is now the responsive design). Exact values, badge logic and chart math all live here (logic class at the bottom of the file).
- `Deal Tracker (current).dc.html` — recreation of today's Dash dashboard, for comparison.
- `support.js` — the prototype runtime the two files above need in order to render. Do not port it.
- `_ds/` — the Peppy Design System bundle: `tokens/*.css` (colors, type, spacing, radius, elevation, fonts), `styles.css`, and `_ds_bundle.js` with the React primitives used here (`Button`, `Badge`).
- `screenshots/` — the four states above.
- Source of truth for data: the `Product_Tracker` repo — `dash_app.py` (current queries and KPI definitions), `update_amazon_product_list.py` / `update_appletv_product_price.py` (scrapers, store names).
