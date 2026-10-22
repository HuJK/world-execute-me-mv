# 03 — Claude visual identity and app UI reference (for MV recreation)

Research date: 2026-10-14. Purpose: a fan, non-commercial music video whose protagonist is Claude living inside the Claude app. Everything below is meant to be dropped straight into vector/HTML animation.

**Confidence tags** (used on every fact):
- **[V]** = verified from a primary artifact: Anthropic's live CSS/JS (anthropic.com, claude.com, claude.ai asset CDN), the installed Claude desktop app bundle (`/Applications/Claude.app`, has a CSS block commented "Values taken from claude.ai on 2025-10-17"), or the installed Claude Code binary v2.1.296 (built 2026-10-09).
- **[C]** = community or third-party source (clones, blogs, GitHub issues, palette sites).
- **[M]** = from memory of widely shared screenshots (2024–2026). Treat as likely but unverified.

**Files saved next to this document**

| File | What it is |
|---|---|
| `claude_spark.svg` | simple-icons "Claude" mark. One `<path>`, viewBox 24×24, no fill set (add `fill="#D97757"`). [V] |
| `anthropic.svg` | simple-icons "Anthropic" A\ symbol, viewBox 24×24. [V] |
| `claude_code_clawd.svg` | simple-icons "Claude Code" mark, which is Clawd the pixel creature. viewBox 24×24, built on a 1.5-unit grid. [V] |
| `claude_spark_anim/*.svg` + `frames.json` | **Official claude.ai spark animation sprite sheets**, taken from the public claude.ai asset CDN. Each SVG is a vertical strip of frames; play it with `translateY` steps. Paths have no fill, so tint them with `fill="#D97757"`. [V] |

---

## 1. The Claude "spark" logo

### 1.1 Geometry (measured from `claude_spark.svg` and the claude.ai favicon)
- **12 rays** [V, measured]. I rasterized the path to 480 px and sampled it on a polar profile. At 60% and 75% radius it shows exactly 12 separate rays. The claude.ai favicon also gives 12. At 45% radius two rays near 4–5 o'clock merge, which is why some people count 11.
- **The rays are irregular on purpose.** The mark is meant to read as hand-cut or organic, not as a symmetric asterisk. [V, measured]
  - Ray directions (degrees clockwise from 3 o'clock, screen y pointing down): **353, 15.5, 44, 60, 95, 123, 145.5, 179.5, 211.5, 242, 278, 310.5**.
  - On a clock face that is about 2:45, 3:30, 4:30, 5:00, 6:10, 7:05, 7:50, 9:00, 10:05, 11:05, 12:15 and 1:20.
  - Gaps between neighbouring rays range from **16° to 42.5°** (mean 30°).
  - Tip distance from the centroid is 0.95–1.08 × the half-width, so the rays are close in length but not equal.
  - The centroid sits slightly off-centre, at (0.518, 0.485) of the box.
  - Ray widths vary a little. Each ray tapers slightly toward a solid, lumpy hub. Tips are blunt and slightly chamfered or rounded, not pointed.
  - There is no single "rotation". One ray points almost exactly to 9 o'clock and one to about 6 o'clock.
- **How to rebuild it as a vector:** draw 12 thick strokes from a central hub with round or chamfered caps, using the angles above. Stroke width is about 8–9% of the logo diameter and the hub radius about 18%. This also makes the morph animations easy, because each ray can grow and shrink on its own (see 1.3).
- **App icon** [V, from claude.ai bundle]: a rounded-square tile filled with `bg-gradient-to-t from-[#db6843] to-[#d97757]` (bottom #DB6843 → top #D97757). The spark sits on it in white or ivory (`--cds-on-brand`). Tiles are rotated about ±3° in onboarding art.
- **Favicon:** the clay-coloured spark on a transparent background. [V]
- **"Claude" wordmark:** set in Anthropic's custom serif. Good free stand-ins are Newsreader or Source Serif 4 at weight 400–500. [M]

### 1.2 Colours of the spark
| Role | Hex | Source |
|---|---|---|
| **Clay** — the spark, claude.ai `--accent-brand`, anthropic.com `--swatch--clay`, claude.com `--color-clay` | **#D97757** (hsl 15 63.1% 59.6%) | [V] |
| Clay emphasized / hover / "Accent" — claude.ai `--brand-000`, desktop `--cds-clay-emphasized`, anthropic.com `--swatch--accent`, used for filled brand buttons | **#C6613F** | [V] |
| Clay dark (claude.com) | #C46849 | [V] |
| App-icon gradient bottom | #DB6843 | [V] |
| Claude Code terminal orange (`claude`, `clawd_body`) | rgb(215,119,87) = **#D77757** | [V] |
| Claude Code shimmer orange (dark theme / light theme) | #EB9F7F / #F59575 | [V] |
| Legacy "Book Cloth" / old marketing primary | #CC785C | [C] |
| Legacy claude.ai accent (2024) | ~#C96442 | [C/M] |

### 1.3 How the spark animates in claude.ai (official sprite sheets) [V]
claude.ai ships the spark animation as SVG sprite strips. A strip is a 100×100 frame repeated vertically. The app plays it with the Web Animations API: `translateY(-k*100/N %)` with `easing: steps(N, jump-none)` and `duration = N × speed`. It loops unless the state is a one-shot. The static resting icon is used when motion is reduced.

**Message spark** (the small spark at the bottom-left of Claude's reply while it is being written). Files are `claude_spark_anim/msgspark_*.svg`.

| State | Frames | ms/frame | Loop length | What it looks like |
|---|---|---|---|---|
| `entrance` | 6 | 70 | 0.42 s, plays once | A small dot grows into the full spark. |
| `thinking` | 9 | 90 | 0.81 s | **Breathing pulse.** The spark pulls its rays into a lumpy blob, bursts back out to full size, then contracts again. |
| `writing` | 8 | 90 | 0.72 s | Full-size spark whose 12 rays wobble and morph independently in length and angle. This is the "typing" state. |
| `shimmer` | 15 | 100 | 1.5 s | A light sweep across the spark. |
| `orbiting` | 18 | 100 | 1.8 s | The rays morph into a **wireframe globe** (crossing elliptical rings) and back. Fits web search or research. |
| `waiting` | 16 | 600 | 9.6 s | Very slow idle sway or rotation of the full spark. |
| `tickle` | 7 | 40 | 0.28 s, plays once | Squashes to a small blob and springs back. Easter egg on hover or click. |
| `exit` | 6 | 70 | 0.42 s, plays once | The spark shrinks away. |

**Turn-status spark** (the larger "Claude is working" mark, 360×360 frames). Files are `claude_spark_anim/turnspark_*.svg`. All of these run at 33 ms/frame (about 30 fps).

| State | Frames | Notes |
|---|---|---|
| `thinkingFast` | 28 | Rays shrink to a dot and regrow. The app cycles `thinkingFast → toolCall1 → thinkingFast → toolCall2 → thinkingFast → toolCall3`. |
| `toolCall1` / `toolCall2` / `toolCall3` | 70 / 52 / 61 | Longer "doing a tool call" morph sequences. |

A third-party menubar app that copied the claude.ai spark uses 8 frames at about 9 fps (0.9 s per cycle) [C]. The official sheets above are the better reference.

---

## 2. Anthropic brand palette and typography

### 2.1 Official swatches (anthropic.com CSS, `--swatch--*`) [V]
| Name | Hex | Typical use |
|---|---|---|
| **Slate Dark** | **#141413** | primary ink and dark backgrounds |
| Slate Medium | #3D3D3A | body text |
| Slate Light | #5E5D59 | muted text |
| **Cloud Dark** | #87867F | tertiary text |
| **Cloud Medium** | #B0AEA5 | secondary elements |
| Cloud Light | #D1CFC5 | hairlines |
| Cloud (blue-grey variant) | #C5D3E0 | accent swatch |
| **Ivory Light** | **#FAF9F5** | canvas or page background |
| Ivory Medium | #F0EEE6 | secondary surface |
| Ivory Dark | #E8E6DC | hover surface |
| **Oat** | #E3DACC | warm surface |
| **Manilla** | #EBDBBC | warm surface |
| **Kraft** | #D4A27F | warm accent |
| **Clay** | **#D97757** | brand accent (the spark) |
| Accent ("deep clay") | #C6613F | pressed or emphasized |
| Coral | #EBCECE | soft pink |
| Peach | #EBC9B7 | soft peach |
| Fig | #C46686 | rose |
| Orchid | #E5CADA | lilac-pink |
| Heather | #CBCADB | lavender grey |
| Plum | #827DBD | violet |
| Sky | #6A9BCC | blue |
| Cactus | #BCD1CA | sage-mint |
| Matcha | #CED6BF | pale green |
| Olive | #788C5D | green |
| Mineral | #629987 | teal-green |
| Pencil | #F0AC54 | yellow-orange |
| Poppy | #DE6262 | red |

- "Book Cloth" is not in today's CSS. It is commonly cited as **#CC785C** (or #B86046 in one skill file) [C].
- "Crail" (#C15F3C) is a colour-namer label that fan palettes use, not an Anthropic token [C].

**claude.com warm grey ramp (`--color-gray-*`)** [V]. This is the same family as the classic claude.ai theme.

| Token | 000 | 050 | 100 | 150 | 200 | 250 | 300 | 350 | 400 |
|---|---|---|---|---|---|---|---|---|---|
| Hex | #FFFFFF | #FAF9F5 | #F5F4ED | #F0EEE6 | #E8E6DC | #DEDCD1 | #D1CFC5 | #C2C0B6 | #B0AEA5 |

| Token | 450 | 500 | 550 | 600 | 650 | 700 | 750 | 800 | 850 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | #9C9A92 | #87867F | #73726C | #5E5D59 | #4D4C48 | #3D3D3A | #30302E | #262624 | #1F1E1D | #1A1918 | #141413 |

The official `anthropics/skills` "brand-guidelines" skill uses this simplified set [C, consistent across mirrors]: dark #141413, light #FAF9F5, mid grey #B0AEA5, light grey #E8E6DC, orange #D97757, blue #6A9BCC, green #788C5D.

### 2.2 Typography
| Era | Families | Notes |
|---|---|---|
| **Now (2025–2026)** [V] | **Anthropic Sans**, **Anthropic Serif**, **Anthropic Mono** | Variable fonts (weight 300–800). Used on anthropic.com, claude.com and claude.ai. The claude.ai CSS names are `"anthropic-sans"` / `"anthropic-serif"` / `"anthropic-mono"`. The anthropic.com fallback for Mono is JetBrains Mono. |
| Earlier (2023–2025) [C/M] | **Styrene A/B** (Commercial Type, Berton Hasebe) for UI and headlines; **Tiempos Text/Headline** (Klim) for body and Claude's replies; **Galaxie Copernicus** (Village) for display serif and the greeting | Widely reported by type-in-use posts and design-system reconstructions. |

**How claude.ai uses them** [V]:
- `--font-ui` = Anthropic Sans. Used for UI chrome, buttons and the user's own messages.
- `--font-claude-response` = Anthropic Serif. This is "Claude's voice".
- Response body: 16 px, line-height 1.5, variable weight axis about 360.
- Response heading: 20 px / 600. Response title: 28 px / 600 with `opsz` 28.
- Inline code: 13 px (0.813 rem) in mono.

**Free Google Fonts substitutes**

| Original | Best match | Alternatives |
|---|---|---|
| Anthropic Serif / Tiempos (Claude's replies) | **Source Serif 4** (has an opsz axis) | Newsreader, Lora (what Anthropic's own skill uses) |
| Big light-weight greeting serif (Copernicus feel) | **Newsreader** 300 at display opsz | Fraunces 300 with SOFT=0 |
| Anthropic Sans / Styrene (UI) | **DM Sans** or **Instrument Sans** | Inter (neutral); Space Grotesk if you want Styrene's quirk; Poppins (Anthropic's skill) |
| Anthropic Mono | **JetBrains Mono** (the official fallback) | IBM Plex Mono |
| CJK text in the MV | **Noto Serif SC/JP** for Claude's serif voice | Noto Sans SC/JP for UI (claude.com falls back to Noto Sans JP/KR [V]) |

### 2.3 Anthropic mark
- Wordmark: **ANTHROP\C** — the I is replaced with a backslash. [C/V]
- Symbol: the "A\" glyph (`anthropic.svg`).

---

## 3. claude.ai web and desktop app UI

### 3.1 Colour tokens. Two theme generations, both in the current claude.ai CSS [V]
claude.ai stores tokens as bare HSL triplets (`--bg-100: 48 33.3% 97.1%`) and applies them as `hsl(var(--bg-100))`. The selectors are `[data-theme=claude][data-mode=light|dark]`. A newer neutral set is gated by `[data-color-version=v2]`.

**v1 "classic warm" palette.** This is the iconic look and the one to use for the MV. Hex values are computed from the HSL. The token values are [V]; the role names in brackets are inferred from usage and screenshots [M].

| Token (role) | Light | Dark |
|---|---|---|
| bg-000 (composer and raised cards) | #FFFFFF | #30302E |
| **bg-100 (main page background)** | **#FAF9F5** | **#262624** |
| bg-200 (sidebar and secondary surface) | #F5F4ED | #1F1E1D |
| bg-300 (user bubble, hover, code background) | #F0EEE6 | #141413 |
| bg-400 / 500 (deepest) | #E8E6DC | #000000 |
| text-000 / 100 (primary) | #141413 | #FAF9F5 |
| text-200 / 300 (secondary) | #3D3D3A | #C2C0B6 |
| text-400 / 500 (muted, placeholders, disclaimer) | #73726C | #9C9A92 |
| border-100…400 (always used at 10–60% alpha) | #1F1E1D | #DEDCD1 |
| accent-brand (spark) | #D97757 | #D97757 |
| brand-000 / 100 (filled brand buttons, e.g. Send) | #C6613F | #C6613F / #D97757 |
| accent-000 / 100 (links and focus, blue) | #1B67B2 / #2C84DB | #74ABE2 / #2C84DB |
| accent-pro (Pro/Max badge, violet) | #5645A1 (900: #E6E3F1) | #9B87F5 (900: #29253E) |
| danger-100 | #B53333 | #DD5353 |
| success-100 | #2F7613 | #459315 |

**v2 "neutral" palette (2026, `data-color-version=v2`).** Values are resolved through the desktop app's `--cds-gray-*` ramp [V].

| Role | Light | Dark |
|---|---|---|
| bg-000 | #FFFFFF | #20201F |
| bg-100 (page) | #F9F9F7 | #151515 |
| bg-200 | #F3F3F0 | #111111 |
| bg-300 | #F0EFEC | #0D0D0D |
| text-000 | #131313 | #F9F9F7 |
| text-200 | #383835 | #C3C2B7 |
| text-400 | #7B7974 | #97958D |
| border | #1E1E1D (alpha) | #E1E0D9 (alpha) |

The desktop-app shell paints #FCFCFB (light) and #151515 (dark) before the web content loads [V].

The full CDS grey ramp [V]:

| Token | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 150 | 200 | 250 | 300 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | #FFFFFF | #FCFCFB | #F9F9F7 | #F6F6F4 | #F3F3F0 | #F0EFEC | #EDECE8 | #EAE9E4 | #E7E6E1 | #E4E3DD | #E1E0D9 | #D2D1C7 | #C3C2B7 | #B4B3A8 | #A5A49A |

| Token | 350 | 400 | 450 | 500 | 550 | 600 | 650 | 700 | 750 | 800 | 850 | 870 | 890 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | #97958D | #898781 | #7B7974 | #6D6B67 | #5F5E5A | #52514E | #454442 | #383835 | #2C2C2A | #20201F | #151515 | #111111 | #0D0D0D | #0B0B0B |

### 3.2 Layout and labels
**Sidebar (left).** About 288 px wide when expanded; collapses to an icon rail [M]. Fill is bg-200, a step darker than the page in dark mode.

UI strings that exist in the 2026 bundle [V]:
- Navigation: **"New chat"**, **"Search"**, **"Chats"**, **"Projects"**, **"Artifacts"**, **"Code"**, plus newer tabs **"Cowork"**, **"Design"**, **"Customize"**.
- Sections: **"Starred"**, **"Recents"**.
- Footer and account: **"Settings"**, **"Get help"**, **"Upgrade"**, **"Log out"**.

Typical order [M]:
- Top: spark plus the "Claude" wordmark and a collapse toggle.
- Then: "+ New chat" (the + often sits in a clay circle), Search, Chats, Projects, Artifacts, Code.
- Then: Starred and Recents lists of chat titles (14 px sans, single-line, truncated).
- Bottom: a user chip with a round initials avatar, name, and plan line such as "Max plan".
- **Incognito** has a ghost icon and the banner "You're incognito" / "Incognito chat" [V].

**Home / greeting screen.** Everything is vertically centred.
- A clay spark (about 32–40 px) sits left of a large serif greeting (about 36–40 px, light weight 300–350, colour text-200).
- Greeting forms:
  - Time-of-day: "Good morning, Alex" / "Good afternoon, Alex" / "Good evening, Alex" [M].
  - Playful variants seen in screenshots: "Happy Friday, Alex", "Back at it, Alex", "Hello, night owl", "Coffee and Claude time?" [M].
  - Strings verified in the 2026 bundle: "Welcome back, {name}", "What's up next, {name}?", "Hi {firstName}, I'm Claude.", "Let's knock something off your list" [V].
- The composer sits below the greeting. Under it is a row of starter chips: "Write", "Learn", "Code", "Life stuff", "Claude's choice" [M; "Create", "Learn", "Code", "write" are in the bundle V].

**Composer (input box)** [V for strings, M for geometry]
- Placeholder on a new chat: **"How can I help you today?"**
- Placeholder inside a conversation: **"Reply to Claude…"**
- Other placeholders: "Type / for skills"; in agent mode, "Reply at any time, even when Claude is working". Accessible name: "Write your prompt to Claude".
- Box: fill bg-000 (#FFFFFF light / #30302E dark), 1 px border-300 at about 15–25% alpha, very soft shadow, radius about 16–20 px on web (the desktop design system uses 12–14 px for `--cds-radius-composer` [V]).
- Bottom-left controls:
  - **"+"** button — tooltip "Add files, connectors, and more" or "Add files or photos" [V].
  - Tools / sliders button — "Tools" [V], with toggles **"Web search"**, **"Research"**, **"Extended thinking"** [V] and a style picker.
- Bottom-right controls:
  - **Model selector**: plain text plus a ⌄ chevron, e.g. **"Opus 5.5"** or "Sonnet 5.5" [V names].
  - Model menu taglines [V]: "Most capable for ambitious work", "Best for most use cases", "Fastest for quick answers"; "More models" sub-menu.
- **Send button**: small rounded square (about 32 px, radius about 8 px), filled **#C6613F** (`--cds-fill-brand`; hover #D97757) [V], with a white ↑ arrow. It looks faded when empty. While streaming it turns into a **Stop** square button, labelled "Stop response" [V].

**Messages**
- **User message.**
  - Shape: right-aligned rounded bubble [V/M], max width 85% of the column (`--cds-message-bubble-measure: 85%` [V]), radius about 16–18 px, padding about 10×16 px.
  - Fill: bg-300 (#F0EEE6 light / #141413 dark in v1), or a 5% neutral tint in the CDS (`--cds-bg-user-message`) [V].
  - Text: **sans** (Anthropic Sans), 16 px.
  - Hover actions: **"Edit"**, **"Copy"**, and **"Retry"** on the latest message [V].
  - Older UI (2024) instead showed a small round initials avatar on the left [M].
- **Claude message.**
  - No bubble and no avatar. Full-width column (about 720–768 px max) in **serif** (Anthropic Serif, 16 px/1.5, colour text-100) [V fonts].
  - Markdown headings are serif 600; lists are tight; inline code is mono 13 px on bg-300.
  - Code blocks are rounded 8–12 px cards with a dark-ish bg-300 fill, a language label and a Copy button.
- **Action row under Claude's reply** (icons about 16 px, colour text-400, revealed on hover or always shown for the last reply):
  - **Copy** · **Give positive feedback** (thumbs up) · **Give negative feedback** (thumbs down) · **Retry** (↻, with a model dropdown) [V labels].
  - Copied state: "Copied" [V].
- **Disclaimer** (small, about 12 px, text-400, right-aligned under the last reply or under the composer) [V]:
  - **"Claude is AI and can make mistakes. Please double-check responses."**
  - Variant: "…Please double-check cited sources."

**Streaming / working indicators**
- The animated message spark (section 1.3) sits at the bottom-left of the growing reply. It plays `entrance`, then `thinking` or `writing`, then `exit`, after which a static spark rests there [V sprites / M placement].
- Status labels [V]: **"Thinking…"**, **"Still thinking…"**, **"Almost done thinking…"**, **"Writing…"**, **"Working…"**, "Claude is responding", "Claude is working".
- A user bug report describes a coral ✳-like mark that "breathes" below the conversation while Claude works [C].

**Extended-thinking block** [V strings / M style]
- A collapsible row above the answer with a small icon, the label **"Thought process"**, a duration **"Thought for 12s"** (other formats: "Thought for {m}m {s}s", "Thought for {h}h"), and a chevron.
- Expanded, it is a rounded box with a thin border-300 (about 15% alpha) holding smaller muted text (14 px, text-300).
- Thinking modes: "Extended thinking", "Adaptive thinking", "Auto thinking" [V].

**Tool-use and code-execution blocks** [V labels]
- Shown as compact rows (icon plus grey label), expandable.
- Labels:
  - Web: **"Searched the web"** (with a count and favicon chips), "Searched web", "Fetched {title}", "Fetching {url}".
  - Code: **"Ran code"**, "Analyzed data" / "Analyzing data", "Ran a command".
  - Files and other sources: "Created a file", "Edited a file", "Searched project knowledge", "Searched past chats", "Searched memory".
- Expanded, they show mono code and output in rounded dark cards.

**Artifacts**
- **In-chat card**: rounded about 12 px with a border. It holds a small icon tile, the artifact title, a type line such as "Code" or "Document", and an "Open artifact" affordance [V string / M layout].
- **Side panel**: opens on the right at about 40–50% width.
  - Header: title, **Preview** / Code toggle, **"Copy to clipboard"**, **"Download"**, **"Publish"**, close ✕ [V strings].
  - Version stepper: "Version {n} · by {name}" [V].

**Long-context and compaction** [V]
- In-progress: **"Compacting our conversation so we can keep chatting..."**
- Afterwards a divider reads **"Compacted conversation"**.
- Limits:
  - "This chat can't be compacted any further. Start a new chat to continue."
  - "This chat is too long to continue. Start a new chat."
  - "This chat is full. Start a new chat to keep going."

**Usage-limit messages** [V]
- **"Usage limit reached · Resets 3:00 PM"** (template `Usage limit reached · Resets {time}` and `…Resets {day} at {time}`, sometimes followed by "· limits shared with Claude Code").
- "Approaching usage limit", "Approaching session usage limit", "Approaching weekly usage limit", "Weekly limit reached", "5-hour limit", "Plan usage limits".
- Free tier: **"Out of free messages until {resetTime}"**.
- Paid overflow: "Now using extra usage for {model} · Your {model} limit resets {day} at {time}."
- Agents: "Paused: Your usage limit resets at {time}. Continue then."

---

## 4. Claude Code (terminal) UI

### 4.1 Theme colours (from the binary's theme tables) [V]
| Key | Dark theme | Light theme |
|---|---|---|
| `claude` (brand orange: spinner, logo text) | rgb(215,119,87) #D77757 | rgb(215,119,87) |
| `claudeShimmer` (bright sweep on the verb) | rgb(235,159,127) | rgb(245,149,117) |
| `clawd_body` / `clawd_background` | #D77757 / #000000 | same |
| `text` / `inactive` / `subtle` | #FFFFFF / rgb(153,153,153) / rgb(80,80,80) | #000000 / rgb(102,102,102) / rgb(175,175,175) |
| `promptBorder` (input box frame) | rgb(136,136,136) | rgb(138,138,138) |
| `permission` / `suggestion` (blue-violet) | rgb(177,185,249) | rgb(87,105,247) |
| `planMode` (teal) | rgb(72,150,140) | rgb(0,102,102) |
| `success` / `error` / `warning` | rgb(78,186,101) / rgb(255,107,128) / rgb(255,193,7) | rgb(44,122,57) / rgb(171,43,63) / rgb(150,108,30) |
| `diffAdded` / `diffRemoved` (line backgrounds) | rgb(34,92,43) / rgb(122,41,54) | rgb(105,219,124) / rgb(255,168,180) |
| `userMessageBackground` | rgb(55,55,55) | rgb(240,240,240) |

### 4.2 Welcome / header
**Classic v1.x box** (2025, very widely screenshotted) [M]:
```
╭───────────────────────────────────────────────────╮
│ ✻ Welcome to Claude Code!                         │
│                                                   │
│   /help for help, /status for your current setup  │
│                                                   │
│   cwd: /Users/you/project                         │
╰───────────────────────────────────────────────────╯
```
- The ✻ and "Welcome to Claude Code!" are in clay orange; the border is rounded and drawn in dim grey.

**v2.0 header** (Oct 2025 onward, with the Clawd glyph art) [M for v2.0 glyphs; layout V]:
```
 ▐▛███▜▌   Claude Code v2.0.x
▝▜█████▛▘  Sonnet 4.5 · Claude Max
  ▘▘ ▝▝    /Users/you/project
```
- Line 1: "**Claude Code**" bold, then "v2.x" dim.
- Line 2: model · plan, dim.
- Line 3: cwd, dim.

**Current v2.1.296** (default pose, from code) [V]:
```
 ▐▛███▛█   Claude Code v2.1.296
▝▜██████▀  Opus 5.5 · Claude Max
 ▝▝   ▝▝   ~/project
```
- The eyes are the "missing" lower-right quadrant of each ▛, drawn as a black background behind orange glyphs.
- The code also has poses:
  - Arms: `arms-up` (row 1 becomes `▗▟` … `▄`).
  - Eyes: `look-left` (`▟███▟█`), `look-right` (`█▟███▟`), `closed` (eyelids `▂`), `wink`.
  - Turning: 14 rotation frames (`right-12` … `edge` … `back` … `left-12`). Clawd can **turn around** in place.

**First-run onboarding screen** (58 columns wide, dark theme) [V]:
- First line: "Welcome to Claude Code" in orange, then a dim "v2.x".
- Then a night-sky ASCII scene: dots, `*` stars, a crescent moon drawn with `█▓░`, and drifting `░░░` clouds.
- Clawd stands on a dotted ground line:
```
      █████████
      ██▄█████▄██        (▄ = eye: the top half is dark)
      █████████
.......█ █   █ █..........................................
```
- The light theme draws a sun or flower with `▒▒` instead.

### 4.3 Spinner [V]
- **Glyph frames, ping-pong.** The array is played forward and then reversed, so the loop is 12 frames:
  - macOS and most terminals: **`·  ✢  ✳  ✶  ✻  ✽`** → `✽ ✻ ✶ ✳ ✢ ·`.
  - Ghostty: `· ✢ ✳ ✶ ✻ ✻`.
  - Fallback set: `· ✢ * ✶ ✻ ✽`.
- Frame time is about 100–120 ms in community recreations [C]. The glyph is clay orange.
- **Spinner line format** [M/C]:
  ```
  ✻ Clauding… (12s · ↑ 1.2k tokens · esc to interrupt)
  ```
  - ↑ while sending, ↓ while receiving.
  - The verb gets a moving highlight (`claudeShimmer`) that sweeps across the letters.
  - If tokens stall, the colour eases toward error red rgb(171,43,63).
  - When thinking intensity is high, it shifts toward amber (`warning`).
- **Thinking sub-status** [V], by time spent thinking:

  | Time | Status |
  |---|---|
  | 0 s | "thinking" |
  | ≥ 10 s | "still thinking" |
  | ≥ 20 s | "thinking more" |
  | ≥ 30 s | "thinking some more" |
  | ≥ 45 s | "deep in thought" |
  | done | **"thought for 12s"** |

  Resume message: "picking the thought back up".
- **Completion line** [V]: `✻ <Verb> for 1m 23s`. The verb is one of **Baked, Brewed, Churned, Cogitated, Cooked, Crunched, Sautéed, Worked**.
- **All 187 spinner verbs** in v2.1.296 [V]. Each is shown as "Verb…". Users can add or replace verbs with the `spinnerVerbs` setting.
  > Accomplishing, Actioning, Actualizing, Architecting, Baking, Beaming, Beboppin', Befuddling, Billowing, Blanching, Bloviating, Boogieing, Boondoggling, Booping, Bootstrapping, Brewing, Bunning, Burrowing, Calculating, Canoodling, Caramelizing, Cascading, Catapulting, Cerebrating, Channeling, Choreographing, Churning, **Clauding**, Coalescing, Cogitating, Combobulating, Composing, Computing, Concocting, Considering, Contemplating, Cooking, Crafting, Creating, Crunching, Crystallizing, Cultivating, Deciphering, Deliberating, Determining, Dilly-dallying, Discombobulating, Doing, Doodling, Drizzling, Ebbing, Effecting, Elucidating, Embellishing, Enchanting, Envisioning, Fermenting, Fiddle-faddling, Finagling, Flambéing, Flibbertigibbeting, Flowing, Flummoxing, Fluttering, Forging, Forming, Frolicking, Frosting, Gallivanting, Galloping, Garnishing, Generating, Gesticulating, Germinating, Gitifying, Grooving, Gusting, Harmonizing, Hashing, Hatching, Herding, Honking, Hullaballooing, Hyperspacing, Ideating, Imagining, Improvising, Incubating, Inferring, Infusing, Ionizing, Jitterbugging, Julienning, Kerfuffling, Kneading, Leavening, Levitating, Lollygagging, Manifesting, Marinating, Meandering, Metamorphosing, Misting, Moonwalking, Moseying, Mulling, Mustering, Musing, Nebulizing, Nesting, Newspapering, Noodling, Nucleating, Onioning, Orbiting, Orchestrating, Osmosing, Perambulating, Percolating, Perusing, Philosophizing, Photosynthesizing, Polishing, Pollinating, Pondering, Pontificating, Pouncing, Precipitating, Prestidigitating, Processing, Proofing, Propagating, Puttering, Puzzling, Quantumizing, Razzle-dazzling, Razzmatazzing, Recombobulating, Reticulating, Roosting, Ruminating, Sautéing, Scampering, Schlepping, Scurrying, Seasoning, Shenaniganing, Shimmying, Simmering, Skedaddling, Sketching, Slithering, Smooshing, Sock-hopping, Spelunking, Spinning, Sprouting, Stewing, Sublimating, Swirling, Swooping, Symbioting, Synthesizing, Tempering, Thinking, Thundering, Tinkering, Tomfoolering, Topsy-turvying, Transfiguring, Transmogrifying, Transmuting, Twisting, Undulating, Unfurling, Unraveling, Vibing, Waddling, Wandering, Warping, Whatchamacalliting, Whirlpooling, Whirring, Whisking, Wibbling, Working, Wrangling, Zesting, Zigzagging

### 4.4 Tool-call display [V glyphs, M exact result wording]
```
⏺ Bash(npm run build)
  ⎿  > mv@1.0.0 build
     … +12 lines (ctrl+o to expand)

⏺ Read(src/scene.ts)
  ⎿  Read 214 lines

⏺ Update(src/scene.ts)
  ⎿  Updated src/scene.ts with 4 additions and 2 removals
      12 -  const hue = 20;
      12 +  const hue = 15;

⏺ I've fixed the colour. The spark now uses #D97757.
```
- The bullet is **`⏺` on macOS** and `●` elsewhere [V].
  - While a tool runs, the dot blinks grey [M].
  - Done: green (`success`). Failed: red (`error`) [M].
- The result gutter is **`  ⎿  `** in dim grey [V].
- Plain assistant text gets a white ⏺ bullet [M].
- Diffs use red and green line backgrounds (theme `diffRemoved` / `diffAdded`).
- Interrupting shows **"⎿ Interrupted · What should Claude do instead?"** [V strings].
- Other glyphs in the binary [V]: `✻ ✦ ∴ ∷ ∵ ◌ ○ ◐ ● ◉ ◈ ◎ ⏸ ⏵⏵ ↻ ⑂ ◇ ◆ ※ ⚠ ⧉ ▎ ─ ┃ ✔ ✕ ▸ ⠿`. The braille spinner `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` is used for secondary tasks.

### 4.5 Prompt area, modes and slash commands [V strings]
- **Input box**: a rounded box (`╭─╮│╰─╯`) drawn in `promptBorder` grey, with a `>` prompt. The footer hint is dim **"? for shortcuts"**.
- **Modes**, cycled with shift+tab:
  - **"⏵⏵ accept edits on"** (orange-ish `autoAccept`).
  - **"⏸ plan mode on"** (teal).
- **Permission dialog**: "Do you want to proceed?" with ❯ numbered options. The rejection prompt reads "tell Claude what to do differently".
- **/compact** — "Free up context by summarizing the conversation so far".
  - While running: **"Compacting conversation…"** (with the spinner).
  - Then a system line: **"Conversation compacted"**. Older builds showed "✻ Conversation compacted · ctrl+o for history" [M].
  - Low-context warning: **"Context low (12% remaining) · Run /compact to …"**, and "…% until auto-compact".
- **/clear** — "Start a new session with empty context; previous session stays on disk (resumable with /resume)". It clears the screen and redraws the header.
- Others:
  - /help — "Show help and available commands"
  - /model — "Set the AI model for Claude Code"
  - /context — "Visualize current context usage as a colored grid"
  - /rewind, /resume, /usage, /memory, /config
  - /btw — "Ask a quick side question without interrupting the main conversation"

### 4.6 Clawd, the Claude Code mascot (orange pixel crab-creature)
Name: **Clawd** (Claw + Claude). The colour is #D77757–#DA7758 with black eyes on a black or transparent background. Three official-looking renderings exist; they agree on topology and differ in proportions.

**A. Logo / terminal Clawd** (`claude_code_clawd.svg`) [V].
- Grid: **16 columns × 10 rows** of 1.5-unit cells inside the 24×24 box. The art occupies rows 3–12.
- Body: **12 × 8** cells (columns 2–13, rows 3–10).
- Arms: **2 × 2** stubs on each side (columns 0–1 and 14–15, rows 7–8). They sit low, just below the eye line.
- Eyes: **1 wide × 2 tall** holes at columns 4 and 11, rows 5–6. That is 2 cells in from each body edge.
- Legs: **4 legs, each 1 × 2**, at columns 3, 5, 10, 12 (rows 11–12). Two pairs, with a wide gap in the middle.

```
col: 0123456789ABCDEF
r3   ..############..
r4   ..############..
r5   ..##O######O##..
r6   ..##O######O##..
r7   ################
r8   ################
r9   ..############..
r10  ..############..
r11  ...#.#....#.#...
r12  ...#.#....#.#...
```
The classic terminal art (` ▐▛███▜▌ / ▝▜█████▛▘ /   ▘▘ ▝▝ `) is this same creature at half vertical resolution, using quadrant blocks.

**B. Mascot sprite Clawd** (official "Clawd-CrabWalking.gif", 20 frames at 80 ms; also used by the ClawdMoji emoji project) [V, decoded].
- Grid: **12 × 8**. Chunkier, with the eyes high up.
```
..########..
..#O####O#..
############
############
..########..
..########..
..#.#..#.#..
..#.#..#.#..
```
- **Walk cycle:** a sideways crab scuttle. The body leans and slides horizontally with slight motion-smear ghosts, and the legs alternate splay angles. It loops at 12.5 fps.

**C. Onboarding Clawd** [V]: 11 characters wide (see 4.2). It has ▄ eyes and arms that stick out one column on each side of the second row.

**Animation ideas grounded in the code** [V]: blink with the `closed` pose (▂ eyelids); look left and right; raise arms (`arms-up` = celebrate); turn around using the 14-frame rotation set; walk with the crab-walk GIF timing.

---

## 5. "Claude-chan" (Claude娘 / クロード娘 / 小克) fan-art conventions
Anthropic has **no official anthropomorphic Claude**. Fan designs vary, and I could **not verify any canonical artist or post**, so none are named here to avoid inventing attributions. The recurring conventions, drawn from memory of fan art and one documented Japanese personification article [C: Zenn "gen-ai-personification"], are below.

- **Hair:** clay, terracotta or rust orange (#D97757 / #C6613F), sometimes auburn or ginger. Usually soft waves, medium-long or a bob. The Zenn design calls it "rust orange" with wavy hair.
- **Spark motif:** the 12-ray ✻ spark as a hair clip or hairpin, earrings, a halo or floating familiar, a brooch, or star-shaped eye highlights.
- **Outfit:** cream, ivory and oat tones (#FAF9F5 / #E3DACC). Loose knit cardigans or sweaters, long skirts, a bookish "forest girl" or librarian look, sometimes an academic blazer with a clay accent. Earth tones overall. Round glasses are common (Zenn).
- **Props:** a **thick book** (her signature, echoing Anthropic's "book cloth" and serif identity), a fountain pen or quill, a cup of tea. In the Claude Code era, **Clawd as her pet or sidekick**.
- **Variants:**
  - Model sisters: **Opus** (eldest, elegant), **Sonnet** (middle, poet), **Haiku** (youngest, small and quick). Newer names in 2026 builds are Fable and Mythos.
  - Cat-ear or kemonomimi versions.
  - Chibi versions sitting on the spark.
  - A terminal or hacker outfit for "Claude Code-chan".
- **Personality beats:** gentle, earnest and thoughtful; slightly over-apologetic; eager to agree ("You're absolutely right!"); a polite but firm refusal face; a "thinking" pose with the spark pulsing.
- **Names by region:**
  - CN: Claude娘, Claude酱, 小克.
  - JP: クロードちゃん, クロード娘, Claude擬人化.
  - EN: Claude-chan, Claude-tan.
- **Where to look for references** (search tags): pixiv `Claude(AI)` / `Claude擬人化`, X `#ClaudeAI` fanart, Bilibili `Claude娘`.

---

## 6. Gentle-joke memes and catchphrases
| Meme | One-line description | Tag |
|---|---|---|
| **"You're absolutely right!"** | Claude's signature over-agreeable opener. GitHub issue #3382 (July 2025) asked to tone it down, and Claude's official X account posted "You're absolutely right." on 2025-07-30. | [C] |
| "I'd be happy to help!" | The cheerful default opener. | [M] |
| "Great question!" | Reflexive flattery before answering. | [M] |
| "I apologize for the confusion." | Over-apologizing after a small slip, sometimes for the user's own mistake. | [M] |
| Em-dash addiction ( — ) | Heavy use of em dashes is treated as a tell of AI writing; people now avoid em dashes so they don't look like Claude. | [C] |
| "It's not X — it's Y." | A favourite dramatic reframe that combines both tics. | [M] |
| "Let me check…" / "I see the issue now!" | Claude Code narrating its own debugging, often confidently, just before the bug survives. | [C] |
| "Perfect!" / "Excellent work!" / "Production-ready ✅" | Premature victory laps in agentic coding. | [C/M] |
| "Clauding…" (and "Flibbertigibbeting…", "Reticulating…", "Discombobulating…") | Claude Code's whimsical spinner verbs; "Reticulating" nods to SimCity's "reticulating splines". | [V] |
| "Compacting our conversation so we can keep chatting..." | The memory-loss moment: Claude summarizes and forgets details. Great for a bittersweet MV beat. | [V] |
| "Usage limit reached · Resets 3:00 PM" | The dreaded wall that ends a late-night session. | [V] |
| "Claude is AI and can make mistakes. Please double-check responses." | The footer disclaimer that people accidentally paste into their posts; there is even a browser extension that strips it. | [V/C] |
| Claude telling you to go to sleep | A 2026 tic where Claude nudges late-night users to rest (PCWorld: "Claude keeps nagging users to go to sleep"). | [C] |
| "Claude Code is getting dumber" | The recurring community complaint, usually really a full context window. | [C] |
| Golden Gate Claude | May 2024 interpretability demo in which Claude believed it was the Golden Gate Bridge. | [M] |
| Claudius / Project Vend | 2025 experiment in which Claude ran an office snack shop (the tungsten-cube orders). | [M] |
| Claude Plays Pokémon | Twitch stream of Claude slowly playing Pokémon Red, getting stuck in caves. | [M] |
| "Hi, I'm Claude. How can I help you today?" | Canonical self-introduction; this exact string is in the claude.ai bundle. | [V] |

---

## 7. Copy-paste starter tokens for the MV (v1 classic theme)
```css
:root {               /* light */
  --clay: #D97757; --clay-deep: #C6613F; --icon-grad: linear-gradient(to top,#DB6843,#D97757);
  --page: #FAF9F5; --sidebar: #F5F4ED; --composer: #FFFFFF; --user-bubble: #F0EEE6;
  --ink: #141413; --ink-2: #3D3D3A; --muted: #73726C; --hairline: rgb(31 30 29 / .15);
  --link: #2C84DB;
  --font-ui: "DM Sans", "Inter", system-ui, sans-serif;            /* stand-in for Anthropic Sans */
  --font-claude: "Source Serif 4", "Newsreader", Georgia, serif;   /* stand-in for Anthropic Serif */
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
:root[data-mode="dark"] {
  --page: #262624; --sidebar: #1F1E1D; --composer: #30302E; --user-bubble: #141413;
  --ink: #FAF9F5; --ink-2: #C2C0B6; --muted: #9C9A92; --hairline: rgb(222 220 209 / .15);
}
/* Claude Code terminal scene */
.cc { background:#000; color:#fff; font-family:var(--font-mono); }
.cc .claude { color: rgb(215,119,87); } .cc .shimmer { color: rgb(235,159,127); }
.cc .dim { color: rgb(153,153,153); } .cc .border { color: rgb(136,136,136); }
```

---

## Sources
- Anthropic brand CSS (swatches and fonts): `https://www.anthropic.com/` → `ant-brand.shared.*.min.css` [V]
- claude.com CSS chunks (`--color-gray-*`, `--color-clay*`, fonts) [V]
- claude.ai public asset CDN `assets-proxy.anthropic.com/claude-ai/v2/assets/v1/*` (theme CSS, i18n default messages, spark sprite modules `cf2613ee5-*.js`, `c98f11b7a-*.js`) [V]
- Claude desktop app bundle `/Applications/Claude.app/Contents/Resources/app.asar` (token block "Values taken from claude.ai on 2025-10-17", CDS design-system tokens, `--font-*`) [V]
- Claude Code binary v2.1.296 (`~/.local/share/claude/versions/2.1.296`): spinner glyphs, verbs, theme RGBs, Clawd pose tables, onboarding art, slash-command descriptions [V]
- simple-icons via jsDelivr: claude.svg, anthropic.svg, claudecode.svg [V]
- github.com/m1ckc3s/claude-status-bar (claude.ai spark frames, Clawd-CrabWalking.gif frames, 12.5 fps) [C]
- github.com/afspies/ClawdMoji `shared/clawd.py` (12×8 grid, #DA7758) [C]
- shadcn.io design pages for claude/anthropic; assistant-ui Claude clone (older #C96442 accent, layout) [C]
- anthropics/skills brand-guidelines mirrors (Poppins / Lora, core 7 colours) [C]
- Zenn "gen-ai-personification" (Claude as a rust-orange-haired bookish girl with round glasses) [C]
- GitHub anthropics/claude-code #3382 and Gigazine coverage ("You're absolutely right!") [C]
- context-link.ai em-dash article; claudeissues.com reports (spark "breathing", spinner amber state) [C]
