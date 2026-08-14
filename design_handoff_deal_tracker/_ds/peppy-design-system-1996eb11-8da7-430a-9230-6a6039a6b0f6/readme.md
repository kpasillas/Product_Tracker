# Peppy Design System

A confident, professional design language: a deep near-black `#0b0b0d` primary on a generous white canvas, broken by a five-stop chromatic accent system (purple / pink / blue / orange / green) that maps to distinct content categories, anchored by Inter at restrained 500 / 600 weights with negative tracking.

## Sources

Everything here derives from one supplied file:

- `uploads/Peppy-Design-System.md` — the brand's own alpha-version design-system spec (front-matter token block plus prose on colour, type, layout, elevation, shape, components, and do's/don'ts).

No codebase, Figma file, screenshots, slide deck, logo, icon set, or photography was supplied. Where this project goes beyond the spec, it is flagged under **Substitutions and gaps** below.

## Products represented

The spec describes two distinct surfaces, and this system ships a UI kit for each:

1. **Marketing site** — hero bands, category card grids, pricing tiers, footer. Chromatic colour lives here.
2. **Console app** — sign-in, sidebar shell, metric cards, data tables, modals, toasts, empty states. Derived from the spec's `ex-*` "Examples (illustrative)" block. No chromatic accents; status colour only.

---

## Content fundamentals

**Voice.** Declarative and factual. Sentences state what the thing is or does, then stop. No hype adjectives, no "revolutionary", no exclamation marks.

**Person.** Second person for actions the reader takes ("Invite teammates", "You can invite teammates now"), third person for descriptions of the system ("Peppy ships as tokens, React primitives and full-page templates"). First-person plural appears only for commitments ("We never share this"). Never "I".

**Casing.** Sentence case everywhere — headlines, buttons, table headers as written, labels. The single exception is the uppercase eyebrow, which is styled uppercase via `text-transform`, not typed in caps. Written source copy stays sentence case so it survives a style change.

**Headline shape.** Short declarative sentences that end in a full stop: "Interfaces that look considered." · "Priced per team, not per seat." · "Five categories, one language." A headline is one clause; the qualification goes in the lead paragraph.

**Lead paragraphs.** Two sentences maximum. The first states the fact, the second gives the consequence. "One near-black primary, five chromatic accents, one typeface. Peppy gives product teams a complete surface language without a single decision left open."

**Buttons.** Verb-first, two to three words: "Get started", "Talk to sales", "Send invites", "Add payment method". Never "Click here", never "Learn more →" (the arrow is the component's job, not the copy's).

**Eyebrows.** One or two words naming the section's category: "Design system", "Pricing", "What's inside", "Adoption". They label, they do not tease.

**Microcopy and errors.** Plain and specific. Say the constraint, not the failure: "Enter 1–500." not "Invalid input". Empty states name the next action: "Create your first project to see it here."

**Numbers and dates.** Numerals always ("4px", "16 primitives", "9 days left"). Dates written "4 August 2026"; abbreviated "4 Aug 2026" in metadata eyebrows.

**Emoji.** Never. Not in UI copy, not in marketing copy, not in the components.

**Vibe.** Engineered, not playful. The system reads as something built by people who measure things — hence exact values in copy (4px, 600, 156 tokens) rather than vague claims.

---

## Visual foundations

**Colour.** Two structural colours carry the system: `--primary` `#0b0b0d` near-black and `--canvas` `#ffffff`. Text runs down a six-step ink ramp (`#0b0b0d` → `#acacac`). `--hairline` `#dcdcdc` draws every border. Five chromatic accents — purple `#6e42f5`, pink `#f24ec2`, blue `#2f8bff`, orange `#ff7a1a`, green `#12c94a` — are **surface fills on category cards only**, never button backgrounds, never text colour, never borders. Green category cards use ink text; the other four use white. Semantic colour (info `#1668f0`, success `#12c94a`, warning `#ffb020`, error `#e83a4e`) is confined to badges, toast dots and validation borders. Never introduce a sixth accent.

**Type.** Inter for everything — display, body, labels, buttons. Inconsolata appears only for technical captions and code-style strings. Weights: 400 body, 500 the workhorse (labels, buttons, nav, mid displays), 550 exclusively for the 12.8px caption, 600 for large displays. **The ceiling is 600** — 700+ never appears. Display sizes carry negative tracking (-0.8px at 80px, -0.16px at body 16px); uppercase eyebrows carry positive tracking (+1.5px at 15px, +0.6px at 12px). Line heights are tight at display (83.2px on 80px) and generous at body (25.6px on 16px).

**Spacing.** 4px base with 2px available for hairline nudges: 2 / 4 / 8 / 12 / 16 / 20 / 24 / 32. Cards pad at 32. Buttons at 12×20. Inputs at 12×16. Nav at 16×32. Bands use 32px horizontal gutters with generous (96px) vertical rhythm and a 1280px max container.

**Backgrounds.** Flat colour only. No gradients anywhere. No photography, no illustration, no repeating pattern, no texture, no grain. Depth comes from the near-black/white polarity flip and from full-saturation category fills against white. Full-bleed treatment is used for bands (edge-to-edge colour, content constrained to the container) but never for imagery, because the system ships none.

**Corner radii.** 0 for full-bleed bands · 2px tight inline pills · **4px** for buttons, badges and inputs (the system's signature — never a pill CTA) · **8px** for all cards · 9999px for circular icon buttons only.

**Cards.** White fill, 1px `--hairline` border, 8px radius, 32px padding, no shadow by default. That is Level 1 and it covers most cards. The dark variant drops the border and flips to `--primary` fill with white text. Elevation is used sparingly: one featured card per group, no more.

**Shadows.** Five-stop layered drop shadows, very low individual opacities, no spread, no colour tint — `0 84px 24px rgba(0,0,0,0), 0 54px 22px rgba(0,0,0,.01), 0 30px 18px rgba(0,0,0,.04), 0 13px 13px rgba(0,0,0,.08), 0 3px 7px rgba(0,0,0,.09)` at Level 2, deepening to Level 3 for pricing emphasis and Level 4 (`0 24px 24px rgba(0,0,0,.26)` final stops) for modals. There are no inner shadows in the system.

**Transparency and blur.** Almost none. The only transparency is the modal scrim, `rgba(11,11,13,0.32)`, and the 0.8/0.85 opacity on eyebrow and meta text inside chromatic cards. No backdrop blur, no frosted glass, no protection gradients — text always sits on flat colour with a decided contrast pair, so no scrim is needed.

**Animation.** Restrained and short. 120ms for hover fills, 180ms for the standard colour/border transition, 280ms for anything larger, all on `cubic-bezier(.4,0,.2,1)`. No bounce, no spring, no entrance animation, no parallax. The only transform in the system is a 2px lift on linked category cards.

**Hover states.** Primary buttons darken `#0b0b0d` → `#242424`. Secondary buttons tint white → `#f5f5f5`. Nav links move from `--body` to ink. Sidebar rows tint to `#f7f7f8`. Linked category cards lift 2px and gain the Level 2 shadow. Hover never changes size, never changes radius, never uses opacity fades.

**Press states.** Primary goes pure `#000000`. No scale-down, no shrink — the system does not use tactile squash.

**Focus.** Inputs darken the border to ink; no glow, no ring offset.

**Disabled.** Flat `#f0f0f0` fill with `#acacac` text, borders removed. Never a reduced-opacity version of the live state.

**Borders.** One weight, one colour: 1px solid `--hairline`. The two exceptions are the 2px near-black left indicator on the active sidebar row, and the ink border an input takes on focus.

**Layout rules.** Marketing nav is sticky at the top with a hairline bottom rule. The app sidebar is fixed-width (248px) and full-height; content scrolls independently. Toasts pin bottom-right at 24px. Modals centre over an absolutely-positioned scrim. Grids: category cards 3-up desktop (first tile may span two columns), pricing 3-up, metrics 4-up; all drop to 1-up below 479px, 2-up at 768px.

**Imagery.** None is supplied and none should be invented. Where a product screenshot would sit, use a 16:9 block inside 8px card chrome. Where a logo would sit, set the word "Peppy" in Inter 600 at -0.4px tracking.

---

## Iconography

**No icon set was supplied with the brand kit.** The spec names icon-bearing components (`button-icon-circular`, sidebar rows) but ships no glyphs, no icon font, no SVG sprite.

**Substitution:** the UI kits load **Lucide** (`unpkg.com/lucide@0.469.0`, `<i data-lucide="name">`) — a 24×24 grid, 2px round-cap stroke, outline-only set. It matches the system's engineered, unornamented character and its 500-weight type. **This is a substitution and should be confirmed or replaced.**

Rules for icon use in this system:

- Outline only, never filled. Stroke inherits `currentColor`, so icons take the ink ramp like text.
- 16px inside 14px-text contexts (sidebar rows, table cells, inline lists); 20px in card headers; 24px in empty states.
- Icons are never coloured with a chromatic accent. Semantic colour on an icon is allowed only for the green check in feature lists.
- Circular icon buttons (`IconButton`) are the one place the 9999px radius appears; 40px default, 32px for compact toolbars.
- **No emoji, ever.** No unicode pictographs as icons either. The two unicode characters the system does use are the `→` arrow baked into `Button variant="text-arrow"` and the `✕` dismiss glyph in `Toast` — both typographic, both inheriting text colour.

---

## Substitutions and gaps

- **Fonts.** No binaries were supplied. `tokens/fonts.css` loads Inter and Inconsolata from the Google Fonts CDN — the exact families named in the spec, but not necessarily the licensed cuts the brand uses. Inter's variable axis covers the 550 caption weight; a static-cut fallback would need a 500/600 substitution. **Please supply the real font files if they differ.**
- **Logo.** None supplied, so none was drawn. Every wordmark position renders "Peppy" as type.
- **Icons.** Lucide substituted, as above.
- **Imagery / illustration.** None supplied, none generated.
- **Intentional additions.** `Eyebrow` (the spec defines the type role but no component), `SidebarNavRow`, `DataTable`, `Modal`, `Toast` and `EmptyState` (the spec's `ex-app-shell-row`, `ex-data-table-cell`, `ex-modal-card`, `ex-toast`, `ex-empty-state-card` entries define these surfaces with properties but not as primitives). `Card` merges `card-feature`, `card-feature-dark` and `card-pricing`, which differ only by tone and elevation; `Band` merges `hero-band`, `hero-band-dark` and `content-band`.

---

## Index

**Root**

- `styles.css` — the single stylesheet consumers link. `@import` list only.
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent Skills front-matter for use outside this workspace.
- `uploads/Peppy-Design-System.md` — the original supplied spec.

**`tokens/`** — `fonts.css` (@font-face), `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css` (shadows + motion), `base.css` (element resets).

**`components/`** — 16 primitives, each with `.jsx`, `.d.ts`, `.prompt.md` and a directory specimen card:

| Group | Components |
|---|---|
| `actions/` | **Button**, **IconButton** |
| `forms/` | **TextInput** |
| `surfaces/` | **Card**, **CategoryCard** |
| `data/` | **Badge**, **DataTable** |
| `navigation/` | **NavBar**, **NavLink**, **Footer**, **SidebarNavRow** |
| `layout/` | **Band**, **Eyebrow** |
| `feedback/` | **Modal**, **Toast**, **EmptyState** |

**`guidelines/`** — 16 foundation specimen cards across the Colors, Type, Spacing and Brand groups (brand & canvas, category accents, semantic status, ink ramp; display scale, eyebrows, body scale, caption & mono, weight ceiling; spacing scale, spacing in use, radius scale, elevation; wordmark, motion, interaction states).

**`ui_kits/`**

- `marketing/` — Home, Library, Pricing. See `ui_kits/marketing/README.md`.
- `app/` — Sign-in, Overview, Workspaces, Members, Billing. See `ui_kits/app/README.md`.

**`assets/`** — empty by design. No logo, icons, illustration or photography were supplied.
