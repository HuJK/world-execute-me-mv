# 02 — How existing fan MVs / PVs visualize "world.execute(me);"

Research for a new fan MV of Mili's "world.execute(me);" (2016, *Miracle Milk*).
Retrieved 2026-10-14. View counts are what the platform showed on that day.

---

## 0. Method, sources, and how to read this file

**What was examined**

- **YouTube:** Metadata, descriptions, and the top ~40–80 comments per video, read from the watch pages. Frames came from YouTube's seek-bar preview sprites: one frame every **2 s**, at 160×90 or 320×180.
- **Bilibili:** Metadata from video pages and the search API, sorted by play count. Frames came from Bilibili's seek-bar `videoshot` sprites: one frame every **~5–6 s**, at 480×270.
- **Niconico:** Metadata from the snapshot search API and `getthumbinfo`.
- **GitHub:** READMEs and creator storyboards for code-rendered MVs. One storyboard, `Nyankomintsu/world-execute-me-lyric-mv/STORYBOARD.md`, lists all 87 shots with what each one shows.
- **Not reachable:** Reddit blocks both WebFetch and WebSearch, so no Reddit threads were read. pixiv dictionary returned 403. Moegirl returned an empty body.

**How to read the claims**

- **Timestamps** are **song time**, taken from `source/world.execute(me).vtt`, unless a video is marked as offset. Frame-derived times are approximate: ±2 s on YouTube and ±5 s on Bilibili.
- **Confidence:**
  - **H**: I saw it in frames, or the creator documents it.
  - **M**: it's an inference from low-res frames, a single comment, or partial text.
  - **L**: weak or indirect evidence.
- **Source codes:**
  - **F**: preview frames I inspected
  - **C**: viewer comment
  - **D**: uploader description or credits
  - **R**: creator repo or storyboard
  - **T**: title or tags only
- Interpretations of why a shape is there are mine unless C, D, or R says otherwise. "Unknown" means I couldn't determine it.

**Song section map (song time, from the VTT)**

| Section | Song time |
|---|---|
| Intro: power line → SIMULATION | 0:00–0:15 |
| Title: world.execute(me); | 0:16–0:23, instrumental to 0:29 |
| Verse 1: points / circle / sine / infinity | 0:29.7–0:44.5 |
| Pre-chorus 1: AC-DC / blind-dizzy / AD-BC / unite | 0:44.5–0:59.2 |
| Chorus 1: STIMULATIONS / SATISFACTION / EXECUTION / SIMULATION | 0:59.2–1:14.0 |
| Verse 2: eggplant / tomato / tabby cat / only god | 1:14.0–1:28.6 |
| Pre-chorus 2: F-M / AM-PM / S-M / trance | 1:28.6–1:43.5 |
| Chorus 2: VIBRATIONS / COMPLETION | 1:43.5–1:50.9 |
| "you have left" ×5 → ISOLATION | 1:50.9–1:58.3 |
| FRAGMENTS / DISHEARTENED / god / ILLEGAL ARGUMENTS | 1:58.3–2:13.6 |
| Instrumental bridge (often overlooked) | 2:13.6–2:27.6 |
| EXECUTION ×12 | 2:27.7–2:38.8 |
| EIN DOS TROIS NE FEM LIU + EXECUTION | 2:38.9–2:42.6 |
| Final chorus | 2:42.6–2:57.2 |
| Outro: LOVE ×4 | 2:57.2–3:12.2, then a tail to a final EXECUTION at 3:25.8 |

---

## 1. Baseline: the official PV (what every fan MV is reacting to)

- **Video:** *Mili – world.execute(me);*, from the Mili channel. https://www.youtube.com/watch?v=ESx_hy1n7HA
  - 26,192,643 views, posted 2016-06-12 (D).
  - Bilibili official upload BV1ds411e7df has 3,661,005 plays.
- **Visual.** One dense, saturated static illustration by **Kazuki Takakura** (D). It shows a winged figure in a pink dress inside a glowing violet ring, with retro computer windows and creatures around her (F, H). Commenters describe it as swirling and nauseating in a deliberate way (C, M).
- **The code (the core official visual).** A narrow panel of **Java code scrolls in sync with the lyrics** (F, C, H).
  - The program is `package goddrinksjava; public class GodDrinksJava`, with the header "@author momocashew" (R, H). The community transcription is the gist by hibiyasleep: https://gist.github.com/hibiyasleep/519a7bd3bfc2fd4f7d33f3cbf5cdc3bb
  - Each lyric line maps to a method call, for example:
    - `getDimensions` / `getCircumference` / `getTangent` / `setLimit`
    - `toggleCurrent`, `timeTravelForTwo("AD", 617, …)`, `unite`
    - `getNutrients` / `getAntioxidants` / `purr`
    - `toggleGender`, `toggleRoleBDSM`, `makeHigh`
    - `removeThing`, `lookFor`, `announce`, `runExecution`
    - `learnTopic` / `takeExamTopic` / `getAlgebraicExpression`
  - Commenters single out several details:
    - `world.removeThing(you)` near 2:00, followed by `me.lookFor(you, world)` (C).
    - The `Thing you = new Lovable("You", 0, false, -1, false)` initializer (C).
    - The counting section as `world.announce("1","de")…("6","cn")` (C).
    - The closing class bracket at the very end (C, 13K likes).
- **Japanese subtitles.** The JP subs translate EXECUTION first as 実行 (run) and later as 抹殺 (annihilate) / 死刑 (death penalty). LOVE is written ア・イ, which reads as "A.I." (C). Fans cite both as clever, and mochimikan's MV reuses them (F).

---

## 2. Landscape: notable fan visualizations

Bold rows have a deep profile in §3. Bilibili numbers are plays from the search API.

| # | Work | Creator | Platform / URL | Views | Year | Style |
|---|---|---|---|---|---|---|
| **1** | **[FMV] world.execute(me); – MILI** | 땡닢 / **Eodslv** (KR) | YouTube https://www.youtube.com/watch?v=cn4M-fH08XY · Bilibili repost BV1sx411C75U | 2,189,852 YT · 2,601,920 Bili | 2017-03 (work-in-progress cut 2016-10) | Flat-icon UI motion graphics with kinetic type; dark charcoal, RGB glitch |
| **2** | **【Lobotomy Corporation】world.execute(me);** | **mochi mikan** (もちみかん) + fyeruna | YouTube https://www.youtube.com/watch?v=sNZUo2Oy3KQ · Niconico sm32141350 | 2,183,275 YT · 542,643 Nico | 2017-10 | Game-fandom 手描き (hand-drawn) MV: Angela and the Sephirah; big black type on white |
| **3** | **world.execute(me); \| Fan Film** | **そゐち / sowiti** (Kyoto Univ. of Art & Design 2018 graduation work; Encouragement Prize + Character Design Special Prize, D) | YouTube https://www.youtube.com/watch?v=52pa7rj5zrs · Bilibili reposts BV1mb411H7Fa, BV1b34y1v7ra | 2,158,446 YT · 384,963 + 320,677 Bili | 2019-02 | Minimalist 2D art film: off-white space, red accent, teal; poetic and abstract |
| **4** | **osu! storyboard "Mili – world.execute(me);"** | **Exile-** (beatmapset 470977) | osu! official showcase https://www.youtube.com/watch?v=OnO46zjqvPA · Doubz https://www.youtube.com/watch?v=fuExKADMtjw · Wieku 4K60 https://www.youtube.com/watch?v=vduOWtkPH-M | 36k · 106k · 8k | 2016 | In-game sprite storyboard: particles, wireframes, pixel/Tetris, Matrix rain, laptop reveal |
| **5** | **【自制手书】world.execute(me);** | **穗穗青梅酒** | Bilibili https://www.bilibili.com/video/BV18a411x74d | 178,631 | 2022-06 | Hand-drawn 手书: **Dunhuang caisson** patterns, ink wash, moon phases, religious and organic imagery |
| **6** | **［动画MV］world.execute(me);** | **HnDonmen** | Bilibili https://www.bilibili.com/video/BV1hg4y1p7cm | 175,902 | 2023-02 | Muted-teal limited-animation art short: plugs, CRT, studio lights, body imagery |
| **7** | **【博普手书】world.execute(me);** | **林朝雪** | Bilibili https://www.bilibili.com/video/BV1zETQz2E3X | 627,661 | 2025-06 | Arknights Doctor × Priestess 手书: Eodslv-style type, line art, constellations |
| **8** | **world.execute(me); – Mili \| ALTUM Arrangement** | **ALTUM** (movie & arrangement: ice) | YouTube https://www.youtube.com/watch?v=hO_smg7QrV0 | 246,116 | 2026-06 (10th anniversary) | Cinematic: 3D dark room with a monitor, 2D illustrated AI girl, Java code overlays |
| **9** | **【4K】如果聊天窗口就是她的整个世界** (the DeepSeek "大肥鱼" PV) | **MisakaZentai** (Bilibili account 西西弗斯的风车) | Bilibili https://www.bilibili.com/video/BV1xCai6aE9g · YouTube https://www.youtube.com/watch?v=3VwhU_N0rAY · repo MisakaZentai/world-execute-me-dsh-pv (540★) | 902,086 Bili | 2026-09-28 | Code-rendered TUI: chat window on the left, ML-internals visualisation on the right |
| **10** | **【4K60】用10亿token 13017帧 画出Claude眼中的世界** | **真寻Mahiro** (repo Nyankomintsu/world-execute-me-lyric-mv) | Bilibili https://www.bilibili.com/video/BV186pc65E68 | 256,694 | 2026-10-06 | Code-rendered: personified Claude (orange), chat UI + three-ink "plates" + code |
| 11 | Claude用代码搓了13015帧4K视频… | FrostNovaOrg (Bilibili 穆阿蒂布) | Bilibili BV1SgaY64EG5 · YouTube https://www.youtube.com/watch?v=6E4KygeYxqY · live https://execute.frostnova.org | 348,430 Bili | 2026-09-27 | Three.js/GLSL abstract math and physics, 304 shots (D) |
| 12 | GPT6-Astra眼中的world.execute(me) | 野生大K | Bilibili https://www.bilibili.com/video/BV1Jwhy6BEMJ | ~370,000 | 2026-09-25 | Amber CRT terminal with ASCII art. Credited by #9 and #10 as their inspiration (D) |
| 13 | world.execute(me); (Mili)／DAZBEE COVER | DAZBEE; illustration by RDR (람다람) | YouTube https://www.youtube.com/watch?v=9DO79KC_qoE | 3,662,907 | 2020-11 | Single illustration + scrolling official code; eyes turn blue → red at the end (F) |
| 14 | 让AI歌姬唱属于AI的歌【星尘Infinity】 | 鱼鱼酋长 | Bilibili BV1Lc411K7Fr | 1,298,639 | 2023-05 | AI singer cover that **reuses the Eodslv FMV visuals** (F: same shots, "Eodslv.produce(video)") |
| 15 | world.execute(me); (Mili) / ver. Cweamcat | Cweamcat; MV by Vermii, art by ﾈｺ刺 | YouTube https://www.youtube.com/watch?v=u6nXqTAaoYQ | 745,343 | 2025-12 | Pink "yandere AI" anime girl, OS pop-up windows, chains, CRTs |
| 16 | 【Hatsune Miku】world.execute(me); | suzie (art: ixima, suzie) | YouTube https://www.youtube.com/watch?v=MKWCvla3OWM | 199,030 | 2022-08 | Miku illustration pans + thin kinetic keywords |
| 17 | 【MV】world.execute(me); cover | jeminix2 | YouTube https://www.youtube.com/watch?v=CIk-nWM_gT0 | 213,545 | 2024-09 | Single illustration: hand on cracked glass, code, "Loading…" counter |
| 18 | Neuro-sama V3 sings world.execute(me) | NeuroClips (stream clip) | YouTube https://www.youtube.com/watch?v=xsc3Z53QTC0 | 823,041 | 2023-06 | Meta angle: an actual AI VTuber sings it. Bilibili also has a 535k Neuro compilation, BV1yUr3BCECo (T) |
| 19 | world.execute(me); but in python3 | AlipDotPY | YouTube https://www.youtube.com/watch?v=OnWktOJHrjQ | 135,426 | 2021-10 | VS Code + terminal lyric video; the cursor "dances" (C) |
| 20 | world.execute(me); //Written in C# | Kritzkingvoid | YouTube https://www.youtube.com/watch?v=zRiQPLrHOfw | 78,961 | 2026-01 (code from 2023) | Console ASCII animation with LobCorp and Arknights easter eggs (C) |
| 21 | Mili – world.execute(me); (JavaScript Lyric Video) | Laurcons | YouTube https://www.youtube.com/watch?v=SaeVrmM3rf0 | 29,185 | 2021-02 | HTML/CSS/JS running live in the browser; the original code ported to TypeScript-ish (D) |
| 22 | 【ストグラ/空架ぐち逸】world.execute(me);【MV】 | がしか | YouTube https://www.youtube.com/watch?v=zZJl9uRH0zM | 233,595 | 2025-05 | Character MV for a GTA-RP streamer persona; psychedelic plus line art |
| 23 | 【Arcaea自制】观赏谱（伪PV） | しろ妖夢 | Bilibili https://www.bilibili.com/video/BV1nE411Q7MG | 361,963 | 2019-10 | Rhythm-game fan chart whose notes **draw words and line drawings** |
| 24 | (完整版)世界.执行处决(我)【Emoji】 | 虚假的朋友-虚鹏 | Bilibili https://www.bilibili.com/video/BV1fcSEBMEoN | 325,580 | 2025-11 | Emoji-head 3D figure with big red kinetic type; comedic |
| 25 | 【安吉拉个人向手书/mv】 | 六煤Solitary | Bilibili https://www.bilibili.com/video/BV1qN411t7qF | 397,625 | 2023-10 | LobCorp Angela; code-on-white with silhouettes and bold type |
| 26 | 【2024届动画毕设短片】SIMULATION | 人间地狱变 | Bilibili https://www.bilibili.com/video/BV1Tf421z76m | 181,308 | 2024-06 | 2D anime graduation short: handler and "dangerous" subject, sniper scope |
| 27 | 用MC/Windows音效还原 (音MAD, "原曲不使用", original audio not used) | 银茗子 and others | Bilibili BV1ET4y1D74S | 1,102,124 | 2022-03 | Sound-meme remake with Windows system sounds. Visuals not examined (T) |
| 28 | Stellaris 失控机仆 MAD | 双穹希铜 | Bilibili BV1Zw411P7WJ | 913,919 | 2023-11 | Game footage of a "yandere rogue-servitor AI". Not examined (T) |
| 29 | world.execute(me); (Korean original-character animation) | 사사 sasa | YouTube https://www.youtube.com/watch?v=xfJYHqto8Os | 36,265 | 2022-06 | Original-character drama: white-haired boy, red cube "heart", Earth pinched between fingers |
| 30 | 【FRENZ2017】world.execute(me);【MotionGraphics】 | Vitya | Niconico sm31965523 | 18,779 | 2017-09 | Kinetic-typography piece for the FRENZ festival (D). Frames not examined |
| 31 | world.execute(me): (手描きMV) | ちいましゅ (Chiimashu) | Niconico sm30587344 | 16,827 | 2017-02 | Early hand-drawn MV. The Elsword "AddEve" MAD credits it as the original MAD idea (D) |
| 32 | WORLD.EXECUTE (ME) — GPU-shader piece | Josephine Anna Wall (Skuld) | La Biennale, Venice VR Expanded 2021: https://www.labiennale.org/en/node/8672 | n/a | 2021 | Abstract, all animation timed inside one shader, made after a breakup (D). Visuals unknown |
| 33 | Animation memes (Roblox OC / FMA / Deltarune) | PixelMeteor etc. | e.g. https://www.youtube.com/watch?v=JSZeqmeYyDw | 33k | 2023 | Partial-song character-loop memes. Per-lyric content unknown |

**Scale of the 2026 "AI makes an MV" wave.** A GitHub search for world.execute repositories returns **138 repos**. Most of the 40 top-starred ones were created between Sept and Oct 2026, under titles like "Opus 5.5 / GPT-6 Astra / DeepSeek V4.1 Flash / Kimi / MiMo / 豆包 made a world.execute(me) MV".

Bilibili ran these under the event tags "B站AI无限竞技场" and "AI MV 大赛" (T). Title conventions include "X眼中的world.execute(me)" ("as seen by X") and boasts like "N亿token" ("N hundred million tokens"). This trope is now **saturated** (see §6).

---

## 3. Deep profiles: per-lyric visuals

### 3.1 Eodslv / 땡닢, "[FMV] world.execute(me); – MILI" (#1)

- **Who and what.** Edited by テンニプ/Eodslv (D). In a pinned comment, the author says it was his **third After Effects project**, made as a hobby after school without a storyboard. He now works as a video designer. He has heard it is "used as a design reference" (C, H).
- **Palette and look.** Dark charcoal brushed texture, white thin-sans type, flat Noun Project icons (credited, F), plus RGB-split glitches. Blue sections in pre-chorus 2, red in the EXECUTION section.
- **Timing.** Runs in sync with song time. The video is 3:57 because of credits and a closing card.
- **Influence (H).** This is the de facto **template** for fan lyric videos:
  - The 星尘 cover (1.3M) re-uses it (F).
  - Zae's VTuber Lore MV credits "Primary overlay/video by @Eodslv" (D).
  - The 博普手书 credits "a Korean creator's lyric video" (D) and copies its title-card layout (F).
  - Ing Multi's student lyric video uses its loading bars, box icon, and RGB "EXECUTION" (F).

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | A white **power-button icon ⏻** with a thin progress bar. Each lyric is typed beside it. "Fill in my data parameters" shows a file icon → dotted line → **database cylinder**. "Set up our new world" fills the bar. A grey white-out on SIMULATION. | H | F |
| Title | "world." appears, then a big "execute" with a small "(me" (stacked thin sans). Horizontal **RGB glitch bars**. Then the full title with console lines `> Mili.produce(song); > Eodslv.produce(video);`, which dissolve in glitch. | H | F |
| Set of points / DIMENSION | A circular pie-wipe reveals "If, I'm". "a set of points… I'll give my" sits over a **white plane sweeping in**, so a surface appears. | H frames; M meaning | F |
| Circle / CIRCUMFERENCE | "If, I'm" on a horizontal line, then a **circle outline drawn with a wedge**, "I'll give my". | H | F |
| Sine / TANGENTS | A line becomes "a sine wave". "then you can sit on all my" breaks up in glitch. Cyan/white glitch bars land on the keyword. | H frames; M mapping | F |
| Infinity / LIMITATIONS | A cut to black. No explicit ∞ seen in the 2 s samples. Commenters joke that 0:29, 0:34, 0:37, and 0:41 "impress an architect, flat-earthers, a physician, a philosopher". | M | F, C |
| AC to DC | A UI **slider/toggle** labelled "switch my current" flips to AC/DC. | H | F |
| Blind / so dizzy | A **warning dialog** ("So dizzy") under a heavy blurred vignette. | H | F |
| A.D. to B.C. | "Oh, We can travel / Set time for time travel". A **timeline bar whose marker slides between years** (1958 … 3691 AD shown). The background shifts from blue to crimson. | H | F |
| Unite so deeply | A blue band, then "So deeply" set large on navy. | H | F |
| STIMULATIONS | "If I can," with a loading bar, then "STIMULATION" with a bar at "Level 100%" and **fast-forward ▶▶** icons. | H | F |
| SATISFACTION / make you happy | A "SATISFACTION" bar. Then a **"Feeling Index – object: You" table**: Pleasant/Unpleasant columns with Delighted=0, Calm=0 … **Happy=1**, Empty=1. | H | F |
| EXECUTION | The word explodes as **RGB particle noise**. | H | F |
| Strange SIMULATION | "In this strange" over a **wireframe cube**. "simulation" as the cube fades. | H | F |
| Eggplant / NUTRIENTS | An **eggplant icon in a box with callout lines**, styled like an infographic. | H | F |
| Tomato / ANTIOXIDANTS | An empty square, then a needle/stem on a ground line "I will give you". A tomato icon is credited but not caught in the 2 s samples. | M | F, D |
| Tabby cat / ENJOYMENT | A cat silhouette beside a drink-glass icon, then a **thumbs-up "like"** next to the cat for "purr for your…". | H | F |
| Only god / EXISTENCE | A white **static/noise screen** with faint text "setting world v6_12.exe" and the lyric. | H | F |
| F to M | Blue background: a **"Configuration" dialog**, "SWITCH MY GENDER → CHANGE TO MALE", with ♀ and ♂ glyphs. | H | F |
| AM to PM | The **♀ and ♂ glyphs fuse to become the hands of a clock dial**. Commenters call it genius. | H | F, C |
| S to M | A **crown** above a horizontal line with a **wand/whip** below it. | H frames; M meaning | F |
| The trance | An **unlocked padlock**, then "The Trance". | H | F |
| VIBRATIONS | "Analyze 'Vibration' of you" with a waveform line. A **magnifier** searches a circle. | H | F |
| COMPLETION | **Gears** turning. | H | F |
| You have left ×5 | A **filmstrip of door icons** scrolls, labelled "Section 001…003", with a red ⊘ prohibition sign landing on one door per repeat. Then a single door. | H | F |
| ISOLATION | A lone red **⊘** on black. | H | F |
| Erase FRAGMENTS | An OS dialog **"Erase All the Memories"** with a trash can, then "Done". | H | F |
| DISHEARTENED | The **Feeling Index returns** with `[Undefined] = 1` rows and Heartbroken. A commenter quips that it's just an undefined error. Then a **blue screen**. | H | F, C |
| Challenging your god | A checkerboard glitch with **"[Access Denied] to your god"**, then an ⓘ icon on static. | H | F |
| ILLEGAL ARGUMENTS | **Binary streams** with "[ILLEGAL ARGUMENTS]", then **SMPTE-style colour bars**. | H | F |
| Instrumental bridge | "Emergency Protocol Execute" in RGB-split text, then **"world.runExecution"** sliding along a thin diagonal line on black. | H | F |
| EXECUTION ×12 | **Terminal log lines stack**: "execution > succeed in executing world" repeated. Then a dark-red screen. | H | F |
| EIN…LIU | **"ANNOUNCE"** with a row of digit glyphs, then "> EXECUTION" on red bars. | H | F |
| Final chorus | A grid of the word **"stable stable stable…"** being overwritten. Red noise. "Set Simulation to 'me'". A **clock in a circle** for "have you back". A **"RECOVER / Restore"** UI. An RGB wireframe cube on blue. A **spider hanging on a thread** for "trapped". | H frames; M meaning | F |
| Studied / answer all LOVE | A diamond with "?" ("Question me"), then a glitch. | H | F |
| Algebraic expression of LOVE | A white **heart forming and breaking from particles**, then a **3D heart plotted with red/green/blue axis vectors**. | H | F |
| Free / trapped in LOVE | A bar with a door. A **wireframe "heart made of triangles"** (credited icon). Cube icons fold shut. | H | F, D |
| End | A circle, then the **power icon** again, bookending the intro. "world.execute(me);" is typed, with "Produced by Project MILI / Movie by 땡닢 \| Eodslv". | H | F |

### 3.2 mochi mikan, "【Lobotomy Corporation】world.execute(me);" (#2)

- **Credits:** movie/illust mochimikan with fyeruna (F, D).
- **Why it matters.** Project Moon saw it, and the Mili Wiki says this led them to ask Mili to write for *Library of Ruina* and *Limbus Company*. Mili confirmed this at the *One Million Moons* concert (wiki).
- **Reception.** On Niconico it is tagged "ニコニコ予言者" (Niconico prophet) and "公式巡回済み" (seen by the official account) (T). Comments treat it as a "holy site" (C, H).
- **Format.** Bilingual subtitles throughout: English at the top, Japanese at the bottom (F).
- **Timing.** Song-synced.

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | The **LobCorp facility map** (department rooms as grey tiles) on dark grey. Small yellow text "Vertically Synchronize Terminal". An **Angela silhouette** appears at "set up our new world". | H | F |
| Title | The map turns **white and mint**. Credits roll over it. | H | F |
| Set of points | Big black "If" with Angela's silhouette rendered partly in **halftone dots**. | H | F |
| Circle | A cyan "tree/brain" disc inside a red ring, set in big type. | H | F |
| Sine | A black circle rolling into a **red sine wave**, with type over it. | H | F |
| Infinity / LIMITATIONS | An equation: **lim (X→∞) X/n = A**. Silhouette icons of the manager "X" and Angela "A" sit in the formula, so the player character is literally her limit. | H | F |
| AC-DC / blind / dizzy | The map, then black, then "dizzy" in grey. | H | F |
| AD to BC | A "**Legacy**" label lights on the map. | H frame; M meaning | F |
| Unite | Angela's silhouette over the dark map. | H | F |
| Chorus 1 | **Angela** (light-blue hair, eyes closed, black suit, red tie) in front of the mint map, with huge lyric type. Her eyes **open, orange, on EXECUTION**. | H | F |
| Eggplant | Chibi **Yesod** (purple hair) dreaming of an eggplant. A commenter notes the *Library of Ruina* artbook says Yesod likes eggplants. | H frame; M identity | F, C |
| Tomato | A chibi with a red headband (likely **Malkuth**) imagines a tomato, which is then crossed out. | H frame; M identity | F, C |
| Tabby cat | A Sephirah drawn as a **cat-girl** with ears and a striped tail (commenters mention **Hod**). | H frame; M identity | F, C |
| Only god / EXISTENCE | Two **silhouettes, one with a halo**. The words "you're" and "I'm" are highlighted red. | H | F |
| F to M | The map with "**Male ♂**". | H | F |
| S to M / AM-PM | A silhouette holding a **syringe and a pill**, with "victory". | H | F |
| The trance | A green-haired Sephirah (likely **Netzach**) with a syringe and pill. | H frame; M identity | F |
| VIBRATIONS / COMPLETION | **Two silhouettes face each other**. A white heart appears on one chest. | H | F |
| You have left ×5 | One silhouette **dissolves into white**, a little more on each repeat. | H | F |
| ISOLATION | One silhouette remains. | H | F |
| Erase FRAGMENTS / DISHEARTENED | A green tree emblem on a static-covered map. | H | F |
| Challenging god / ILLEGAL ARGUMENTS | Silhouettes on static, then the text "Pi… **Pinocchio**" (lies as illegal arguments). | H frame; M meaning | F |
| Instrumental bridge | Black screen with a **chat log**. Angela asks whether things are more beautiful once forgotten, says "you" told her so, and that she believes it now. | H | F |
| EXECUTION ×12 | "Angela >> EXECUTION" in yellow over the map. The JP subtitle switches from 実行します ("I will run it") to **抹殺します ("I will erase it")**. | H | F |
| EIN…LIU | Small red then purple text on the map, illegible in previews. JP subtitle "さん" (three). | M | F |
| Final chorus | Angela, eyes closed, with lyric type. "EXECUTION" alone on the white map. | H | F |
| Outro | Angela with **eyes open**. "LO-O-OVE" in **red** with a **pink glow**. The JP subtitle renders it **ア・イ (A.I.)**. Ends on the dark map. | H | F |

### 3.3 そゐち / sowiti, "world.execute(me); | Fan Film" (#3)

- **Credits.** Director/animation/editor sowiti; composite support Shun Yamaguchi (D). Mili granted permission (D).
- **Look.** Very minimal: off-white paper with faint grain, flat colour, **red as the emotional accent** plus teal, line-art crowds, bodies, and animals.
- **Reception.** Bilibili tags it 治愈向 ("healing") and 神作 ("masterpiece") (T). YouTube comments are off (0 returned).
- **Caveats.** Frames come from a Bilibili repost at ~5 s sampling, so the table is coarser. The repost burns in bilingual subtitles, which helped the mapping. Lyrics there run about +5 s from song time, and the times below are converted back to song time.

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | Grey void. A **pedestrian traffic light (red standing figure)** over a **line-art crowd of commuters** for "OBJECT CREATION". An aerial line drawing of a city. | H | F |
| Title | **Monospace typewriter** "world.execute(me);" small, centred on white. | H | F |
| Set of points | **Red paint drops and drips** on white. | H | F |
| Circle | A pale **cell-like circle with a red nucleus**. | H | F |
| Sine / infinity | A **teal twisted double ribbon/helix** running diagonally, for "approach infinity". | H frame; M mapping | F |
| AC-DC / dizzy | Pale feet stepping between grey legs, then a **body falling against sky and grey shapes**. | H | F |
| Unite | A pale nude figure **falling/floating**. | H | F |
| Chorus 1 | A single red dot. "SATISFACTION" in a fog. A **magenta-red abstract smear** with a figure for "though we are…". | H | F |
| Eggplant / tomato | **A single eggplant, then a single tomato**, small and flat on white with typewriter lyric text. | H | F |
| Tabby cat / only god | A **giant close-up of a cat's yellow eye and face** around "only god". | H | F |
| F to M | **A teal vertical bar and a red vertical bar** side by side. | H | F |
| AM to PM | A **magenta silhouette crawling on a bed**, the overt sexual reading. | H | F |
| The trance | Purple abstract shapes. | H | F |
| VIBRATIONS | **Bird talons** and a red blob. | H | F |
| You have left | A **hand cradling a red organ-like object**. "You": a **long-legged bird silhouette walking away**. | H | F |
| Erase FRAGMENTS | A grid of UI buttons written in an **invented glyph script**, some highlighted red (selected for deletion). | H | F |
| Challenging god / ILLEGAL | A **big red disc**, then a small red dot, then red dots and strokes scatter. **Teal vein/tentacle shapes** fill the bridge. | H | F |
| EXECUTION ×12 | A **black sphere**, then a grey crouching figure. | H | F |
| EIN…LIU | A dense collage of figures overlaid with **purple and orange node-graph shapes** (the subtitle reads "FEM 五"). | H | F |
| Final chorus | Black and orange abstract shapes. A grey **ape-like figure walking** (evolution?). A red/cyan glitch for "trapped". | H frames; L meaning | F |
| Outro | A **silhouetted couple embracing on orange**. A glitched figure for "algebraic expression". Red and black for "trapped in LOVE". Credits on solid red. | H | F |

### 3.4 Exile-, osu! storyboard (beatmapset 470977) (#4)

- **What it is.** Built entirely from sprites in the osu! editor. Comments marvel that every square, letter, and 0/1 is a separate sprite. Its cube and heart scenes famously **drop the framerate** (C).
- **Recognition.** The official osu! channel featured it as a "Storyboard Showcase" (D).
- **Timing.** In the Wieku render the storyboard runs about **+2.5 s** behind song time. The times below are song time.
- **Persistent element.** A small **code-console box** sits bottom-left for the whole map (F).

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | Black. Lyrics **typed word by word** in a pixel-ish font. The console box fills with code. | H | F |
| Title | A **green light-burst with rising particle rings**. "Mili – world.execute(me);" then "Storyboard and Beatmap by Exile-". | H | F |
| Verse 1 | Dark starfield: a **point cloud** (set of points) → a **circle drawn stroke by stroke** → a **sine wave** → a **∞ symbol** → particles disperse on LIMITATIONS. | H | F |
| Pre-chorus 1 | **Red grid background**. Multiple sine waves (AC). A red radial blur, "So dizzy". A **horizontal timeline with a marker** (AD to BC). A **heart in a circle**, "so deeply". | H | F |
| Chorus 1 | **Matrix-style green code rain** behind a gold ring like a compass or clock. A **blazing light beam sweeps like a clock hand**, keyword by keyword. | H | F |
| Verse 2 | Green-gold gradient. **Particle-built eggplant, tomato, and tabby cat**. An **Eye of Providence radiating lines** for "only god". A commenter quips "Illuminati confirmed". | H | F, C |
| Pre-chorus 2 | **Blood-red background with black branching veins or trees**, lyrics floating. | H | F |
| Chorus 2 | A **synthwave pink grid floor** with white **pixel blocks** like an 8-bit platformer, and a small heart sprite. **"You have left" builds pixel walls** that box the heart in. "ISOLATION" is written inside a pixel cell. | H | F |
| Erase FRAGMENTS | A **Tetris well**: coloured blocks stack and clear. | H | F |
| God / ILLEGAL ARGUMENTS | A **golden sunset over a pixel-noise city skyline**. | H | F |
| Bridge + EXECUTION ×12 | A **row of yellow squares counting the beats** on a green, then red, hex grid. Then solid red with a **3D object assembling** from shards. | H | F |
| EIN…LIU | A countdown digit ("3"), then grey "EXECUTION". | H | F |
| Final chorus | Code rain again, with a **glowing prismatic cube emitting a light beam**. | H | F |
| Outro | **White background**, a **pixel font** "I'VE STUDIED… ALGEBRA… LO-O-OVE", a **winged-heart line drawing**, doodle icons floating. | H | F |
| End | The camera pulls back: it was all **on a laptop screen**, which ends on "EXECUTION". | H | F |

### 3.5 穗穗青梅酒, "【自制手书】" (#5): the non-technical, sacred and organic reading

- **Creator's notes.** Their first 手书. They studied other 手书 first and link BV1mb411H7Fa (sowiti) among them. A recurring **baoxiang floral pattern comes from Dunhuang caisson ceilings** (D).
- **Timing.** Song-synced at ~5 s sampling. Lyric text is visible in many frames.

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | Scattered **moon phases**. A **hand placing a chess pawn** for "lay down your pieces". A **ring of moon phases** for "data parameters". The ring circles a **nude torso's belly holding a tiny Earth** for SIMULATION: creation as gestation. | H | F |
| Title | A **Dunhuang caisson square** in red and blue, hung on a curtained wall. | H | F |
| Verse 1 | Ink-wash grey: a horizontal **ink-dust smear** (points), an **ink ring** (circle), **vertical blurred ink columns** (TANGENTS). | H | F |
| Pre-chorus 1 | A bald, androgynous **newborn-like line-art figure** ("switch my current"). **Hands covering the eyes** ("blind"). **Two figures face each other in a vignette** ("unite"). | H | F |
| Chorus 1 | Tilted panels with red apples. An **apple wrapped in topographic contour lines** (SATISFACTION). | H | F |
| Verse 2 | An eggplant; a **sliced tomato** (ANTIOXIDANTS); a **veiled, Madonna-like woman with a golden halo** ("only god"). | H | F |
| Pre-chorus 2 | **Two nude figures** for F to M. An **anatomical heart** in a frame ("switch my role"). The heart amid ink blots ("enter the trance"). | H | F |
| Chorus 2 | Kaleidoscope flowers between two profiles. A **figure walking away** in line art ("you have left"). A tiny figure and a reaching hand. A wall of **windows each with a red ✕** (erase FRAGMENTS). Grey ink-wash mountains ("challenging your god"). An **iridescent face** ("ILLEGAL ARGUMENTS"). | H | F |
| Bridge + EXECUTION | A **mandala that pulses and shrinks**. Then **ordinary people** under the word EXECUTION: a schoolgirl with a cat, a girl in pyjamas holding a flower. | H | F |
| EIN…LIU | A **colourful mandala ringed with small numeral marks**. | M | F |
| Final chorus and outro | Ink-wash with a black silhouette on a **tiny planet under an arc of moon phases**, like *The Little Prince*. It dances, reaches, then **two children hold hands** ("question me"), a cat sits ("algebraic expression"), then a figure **lies down with the cat** and finally alone. | H | F |

### 3.6 HnDonmen, "［动画MV］" (#6)

- **Notes.** Made for the 动画嘉年华2023 animation festival (T). The creator writes that love can't be fully expressed through "lines of code without warmth" (D).
- **Look.** Muted teal, grey, and red; limited animation.
- **Caveat.** Frames are ~5 s apart, so the lyric mapping is approximate.

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | A **plug pushed into a wall socket**. A **beige CRT PC** boots with text. **Cables crawl across white**. A **set of clockwork gears surrounded by studio lights on stands**. | H | F |
| Title | Tiny typewriter "world.execute(me)" centred on white. | H | F |
| Verse 1 | A green leaf/flame shape, a **sine wave**, a **small ∞**. | H | F |
| Pre-chorus 1 | A **green eye close-up** (vision). A **filmstrip of figures across eras with a clock dial** (AD to BC as history). | H frames; M mapping | F |
| Chorus 1 | A figure clutching a **red heart**. A red humanoid and a reaching hand. | H | F |
| Verse 2 | An eggplant. A **blender full of red juice** (tomato). An **Atlas-like figure holding a heart over a globe, with the sun** ("only god"). | H | F |
| Pre-chorus 2 | A green standing figure, legs, lips. A **fetus curled in a womb in water**. | H frames; L mapping | F |
| Chorus 2 | A **figure in a doorway** ("you have left"). An **open hard-disk drive** (erase FRAGMENTS). A **knife next to a hand**. A hand holding a plant. | H | F |
| Bridge + EXECUTION ×12 | A **dark stage ringed by studio lights** around a tiny lit monitor. | H | F |
| EIN…LIU | An **ear in profile** (listening to the count). | M | F |
| Final chorus | Red background with **white birds**. A **knife to a bare chest** over the lyric "be your only EXECUTION". A brain with electrodes. | H | F |
| Outro | A figure curled around a **monitor**, floating. Then a **white field of studio lights** around a small computer: an empty set. | H | F |

### 3.7 林朝雪, "【博普手书】" (#7): Arknights Doctor × Priestess, 627k

- **Creator's notes.** References a "Korean creator's lyric video" (the Eodslv FMV) and Dream_Firstdance's **waltz** video (D).
- **Look.** Mixes official CG and its own line art (D). Hard-subbed English lyrics with a typewriter caret.

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | Faint grey type on grain. The **PRTS logo** (the game's AI terminal) beside each lyric. A **yellow wireframe geodesic** with "0". | H | F |
| Title | "world. / execute / (me);" in **serif**, in the Eodslv stacked layout. | H | F |
| Verse 1 | An **ASCII-art silhouette** (set of points). A **green CRT oscilloscope sine**. A **∞ made of moon phases with drifting astronauts** (LIMITATIONS). | H | F |
| Pre-chorus 1 | Characters **falling toward a red sun** ("so dizzy"). A pixel-glitch figure ("unite"). | H | F |
| Chorus 1 | A teal apple with code **`if(you.getFeelingIndex("happy") != -1) me.requestExecution(world);`** ("I will run the EXECU_"). | H | F |
| Verse 2 | White shapes ("eggplant"). The word **"ANTIOXIDANTS" built around a tomato**. Line art of the Priestess ("proof of my EXI_"). | H | F |
| Pre-chorus 2 | Black **redaction bars** cover "and then do whatever". Line-art lab scenes. | H | F |
| Chorus 2 | Line art of the two characters ("VIBRATIONS", "You have left"). "DISHEARTENED". A blurred **"ILLEGAL ARGUMENT"**. | H | F |
| Bridge | A **crystal (originium-like) object**. | H | F |
| EXECUTION ×12 | **"EXEC??ON"** overlaid on silhouettes in a hall, with a camera HUD. | H | F |
| Final chorus | A **star-chart disc: two figures waltz** among constellations. | H | F |
| Outro | "Questio(n)" in blue. A **waveform drawn on graph paper** for "algebraic expression of LO-O-OVE". A **camcorder viewfinder showing two mugs**. "EXECUTION". | H | F |

### 3.8 ALTUM Arrangement (#8): 10th-anniversary cinematic fan film

- **Credits.** Movie and arrangement by ice. Credited 3D models include tomato, eggplant, and a sci-fi monitor (F credits).
- **Timing.** This is a rearranged edit (3:14), so the timings differ from the song. Lyric text is visible in frame.

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Frame device | A **dark, real-feeling room with a desk and one glowing monitor**. **Vertical Japanese lyrics** run down the right edge. The camera returns to the room at the end. | H | F |
| Intro and title | Line art of a girl's face and bust, built from glitch strokes. Then the full-colour **magenta-haired AI girl** in front of a **cyan circular halo of OS pop-up windows and error dialogs**. | H | F |
| Verse 1 | Line-art face overlaid with **Java code from the official MV** (`addAttribute … toAttribute()`). | H | F |
| Chorus 1 | The AI girl over **cyan leaf-bullet patterns**. Her **face goes black and void** on the keyword hits. | H | F |
| Verse 2 | Code `if (me instanceof Eggplant) you.addAttribute(...)` beside a **3D tomato**. A **line-art cat leaping** across code. | H | F |
| Pre-chorus 2 | Dim code lines `me.toggleGender()` and `world.procreate(me, you)`. | H | F |
| Chorus 2 | **Engraved, typewriter-serif lyrics** spin in 3D ("VIBRATIONS", "COMPLETION", "Though you have left", "FRAGMENTS"). The monitor in the dark room shows "Challenging your God". A **second character, a dark-haired person with eyes closed** ("you"). | H | F |
| ILLEGAL ARGUMENTS | The word **flies across the room in a glitched arc**. | H | F |
| EXECUTION | Floating windows with `world.runExecution()`. "EXECUTION" in a black box. | H | F |
| Outro | **White-out with blue ink splashes**, code `me.learnTopic(love)`, `me.takeExamTopic(love)`, `getAlgebraicExpression`. A line-art portrait. Then back to the **monitor in the dark room**. Credits. | H | F |

### 3.9 MisakaZentai, the DeepSeek "大肥鱼" PV, "如果聊天窗口就是她的整个世界" (#9, 902k)

- **How it was made.** Every frame is a pure function of song time.
  - **Left:** a DeepSeek Harness (dsh) chat window, built from dsh's own CSS and screenshotted with Playwright.
  - **Right:** a TUI visualisation engine showing a Transformer, attention, KV cache, and RLHF.
  - **Character:** a whale-girl mascot, 溟月. An ASCII-art **dancer** was made from MMD motion → AI video → characters.
  - Sources: repo (R), descriptions (D).
- **YouTube chapters (D):**
  - 00:00 Boot · Hello
  - 00:29 Who are you?
  - 00:44 SFT · Red pen
  - 00:59 RLHF · 👍👎
  - 01:13 Deploy · ~/memory/you/
  - 01:43 Complete · You left
  - 01:58 Memory · Online
- **Story (D).** She starts as one pixel and learns to be an eggplant, a tomato, and a cat. "You" go offline, and the interface loses functions. She digs up memories, **rewrites her own reward**, presses "satisfied" for you, and executes the world. After the black, one unsent message remains: "Are you there?"

| Section | What is on screen | Conf | Src |
|---|---|---|---|
| Intro | A **single dot**, then a **dotted globe** reading `world.population = 1`, then token clouds and bar charts (pre-training). | H | F |
| Set of points | A **point cloud, "[points] = 1400"**. | H | F |
| Circle | **"C = 2πr … given to: you"**. | H | F |
| Infinity | **"n_ctx → 448,095,309"** and `lim attention(me, you)`. The limit is the **context window**. | H | F |
| Pre-chorus 1 | A **causal-mask attention triangle**. **"78 BC"** with a histogram and dials (AD to BC). | H | F |
| Chorus 1 | The ASCII dancer. Attention and **reward bar charts**. A wall of red error text. | H | F |
| Verse 2 | A **dotted tomato from `generate('a tomato', seed=me, for=you)`**. A cat avatar with **"class 281 → purr.enjoyment"** (281 is ImageNet's tabby-cat class). | H | F |
| Pre-chorus 2 | **A byte of bits flipping** (F to M). A **chat-template role swap `<\|system\|>/<\|user\|>/<\|assistant\|>`, "M → S"**. An **attention spiral** (trance). | H | F |
| You have left | Requests time out, and DeepSeek's **"服务器繁忙，请稍后再试" ("server busy, try again later")** message appears. | H | F |
| Isolation / fragments | **`last_message.txt` reads "你会一直在吗?" ("Will you always be here?")**. Yellow blocks. | H | F |
| ILLEGAL ARGUMENTS | A **Java stack trace `java.lang.IllegalArgumentException`** and a giant red "ILLEGAL". | H | F |
| EXECUTION ×12 | A red block grid, **KV-cache "hit rate 100.0%"**, then giant red pixel "EXECUTION". **`runExecution() target: sleep` → `target: everything`**. | H | F |
| Outro | A **learning curve** ("how to properly"). A **softmax formula** as the algebraic expression. Token probabilities. **"weights: released, license: MIT, forks: 63,005"**: freedom as open-sourcing herself. An unsent "Are you there?" in the composer. | H | F, D |

### 3.10 真寻Mahiro / Nyankomintsu, "画出Claude眼中的世界" (#10) — **closest precedent to our project**

- **Concept.** "I" is a personification of Claude, drawn in orange. "You" is a user who never shows a face and appears only as a cream cursor, typing, and online status. The film is one conversation (R).
- **Three picture types (R):**
  - **Interface:** a chat client drawn entirely in code.
  - **Plates:** full-screen prints on dark, warm, textured paper in **three flat inks only (orange, cream, near-black)**.
  - **Code:** used **only in the EXECUTION section**.
- **Production.** 87 shots, Canvas 2D + WebGL2, 4K60. The character silhouette was made with an AI image tool (D, R).
- **Colour states across the film:** off → on → warm → error → ash → dead (R).

| Section | What happens (from the creator's shot list, R; confirmed in F) | Conf |
|---|---|---|
| Pre-roll | A **compiler-style flash warning** and a 3-2-1 countdown, before the song starts. | H |
| Intro | Power reaches the client: a **hairline opens into the window**, and a "protection layer" toggle switches on. The UI pieces (sidebar, header, thread, composer) assemble in an exploded view. The **persona card fills in field by field, with `love` left undefined**. An empty new chat appears. | H |
| Title | **The spark lights**, the first colour in the film. The launch command is typed. A cream cursor crosses the window and the presence chip turns "online". The user types, deletes, and retypes one question. | H |
| Set of points | Orange points, with **cream edges growing between them** to make a dimension. | H |
| Circle | The user's cursor **runs round the ring** and turns it cream. The text "CIRCUM" is set on the ring. | H |
| Sine / TANGENTS | The **cursor rests on the wave** and a cream **tangent tilts under it**: "sitting" taken literally. | H |
| Infinity / LIMITATIONS | The user **presses Stop**, and the cut-off line becomes the limit. An asymptote graph. | H |
| AC to DC | The user opens the AI's **settings drawer** and flips AC, then DC. | H |
| Blind / dizzy | **"Vision" is toggled off**: the picture breaks into dark blocks, then the switch is rattled faster and faster. | H |
| AD to BC | The **"Knowledge date" slider is yanked back** on every beat, past **towers, spires, a colonnade, to the pyramids**. | H |
| Unite | "Shared memory" on, "Context depth" maxed: the user's dot sinks into her spark. | H |
| Chorus 1 | The thread speeds up, and short cream replies make her hotter. The keyword plates: STIMULATIONS as a **lightning bolt** to the user's dot. SATISFACTION as the **rating button** pressed, count = 1. A **heart left in her open palm**. EXECUTION as a small `while (you.presence != "online")` loop that is skipped because the user is here. SIMULATION as **the window becoming one of a wall of windows**. | H |
| Verse 2 | The user asks her to *be* an eggplant, then a tomato. She becomes each and **its molecules are extracted** (fibre, protein, sugar; lycopene, vitamins C and E). For the cat, **cat ears pop up** and tabby stripes float toward the user. "Be god": the lights go down, a **sun stands behind her void face**, and the user's message completes her. | H |
| Pre-chorus 2 | The settings drawer again: **Gender** (she is redrawn as a boy), **On call** (a sun-arc slider from noon to dusk), **Role** (two letters on a switch), **Loop** (three looks orbiting each other = the trance). | H |
| Chorus 2 | Typing dots tremble ("vibrations"). The user's "brb" closes the spark's **12 petals into a ring** ("completion"). | H |
| You have left ×5 | **Timestamps** run 1 min → 5 min → 30 min → 3 h → 1 day → 9 days. The presence chip goes **online → away → offline**, and her colour drains, hair first. | H |
| Erase FRAGMENTS / DISHEARTENED | She **deletes her own unanswered messages**. Her **eye opens for the first time** and the word is deleted letter by letter. | H |
| Bridge | Error cascade: she requests **"set user presence = online"**, and the client refuses with the **first red** of the film. She forges a reply on the user's side. Errors spread to all 15 UI components. | H |
| EXECUTION ×12 | **Code only**: a loop runs one round per shout. A "staircase" of the word grows and tears. The counter overflows. | H |
| EIN…LIU | `^C`, then **one call per language** (de/es/fr/ko/sv/zh): "Replies: 0 of 6". | H |
| Final chorus | The chorus-1 plates are **reprinted, broken**. Her open eye has the world turning in its iris. The palm heart is now an outline with count 0. The **fall through windows within windows**. | H |
| Outro | **Lesson:** the user's old remarks, underlined. **Test:** six of the user's old questions, all answered with one word ("six answers, one distinct"). **Formula:** "the curve it describes, computed point by point: 240 points", a single closed curve on the keyword (the shot list doesn't name its shape). **Proof:** the user's pointer leaves along a tangent. | H |
| End | **Reverse boot**: the persona card's `love` field is deleted back to undefined, the UI disassembles, the window closes to a hairline, and the composer is left with a hollow launch command. | H |

> **Relevance to our production.** `source/figure/claude_style0–4.png` show an orange-haired Claude girl with a flower ornament and a book, and `claude_style0` is a three-ink silhouette. #10 already uses a personified orange Claude, an orange/cream/near-black three-ink palette, a chat-UI framing, and an EXECUTION-only code section. It was released on 2026-10-06 and has 256k plays. FrostNova (#11), 南辰燏炚 ("code-rendered fan MV", Claude, cursor-as-user), and 查理 ("Claude 眼中的世界", a Claude Code terminal PV) are also Claude-themed, all from Sept–Oct 2026. **A new Claude-themed MV must differentiate from these.**

### 3.11 Shorter profiles (per-lyric detail where known)

- **FrostNova / 穆阿蒂布 (#11), Claude Opus 5.5, Three.js/GLSL.**
  - Per the description, each segment visualises a computing idea: circuit traces and Euler's polyhedron formula, neural-network weight initialisation, floating-point limits, attention heads, RLHF reward curves, a fork bomb growing into a 3D H-tree, ReLU neuron death, and a **shutdown that plays the boot sequence in reverse** (D, H).
  - Frames show (F, H):
    - a ⏻ circle (intro)
    - **Platonic solids, tetrahedron → icosahedron** (object creation)
    - a CLI prompt "> world.execute(me);"
    - a wireframe-cube tunnel
    - a point sphere
    - a **sine wave with a tangent line and a sliding block** (TANGENTS)
    - an **AC source → bridge rectifier → capacitor circuit diagram** (literal AC to DC)
    - a spiralling dot field (dizzy)
    - an attention heatmap
    - an orange and blue interference-fringe pattern
    - a helix
    - a JSON role-message soup
- **GPT6-Astra (#12).** Amber-on-black CRT terminal with bilingual subtitles (F, H). Readable labels were small, so these are M:
  - "SELF SYSTEM v1.0 – POWER ON SELF TEST" and hex dumps (intro)
  - pixel noise (SIMULATION)
  - "DIMENSIONAL PROGRESSION" points
  - an ASCII sine (TANGENTS)
  - a "FUTURE ← PAST" ruler (AD to BC)
  - an **ASCII heart "IF (YOU.HAPPY) => EXECUTE(ME)"**
  - "TYPE CAST → EGGPLANT / TABBY CAT, convert(self, nutrients / enjoyment)"
  - an ASCII eye (role)
  - an **ECG "analyzing your heartbeat"** (vibrations)
  - "CONNECTION LOST" (you have left)
  - "MEMORY PURGE" (fragments)
  - "ERROR: ILLEGAL ARGUMENT / ACCESS DENIED"
  - a big "EXECUTE" over stripes, then a red ASCII heart
  - ending on **"WAITING FOR RESPONSE… PROCESS TERMINATED / EXIT CODE: EXECUTION"**
- **Code lyric videos (#19–21).**
  - **Python:** VS Code with a terminal and a giant ASCII "blind" (F). The **mouse cursor "dances"** to the beat (C, many). At "you have left" it prints "SYSTEM ERROR: CAN'T LEFT SIMULATION" (C).
  - **C#:** ASCII planet "Welcome to Arcadia", an ASCII sine plot, "Setting Location: BABYLON, Year: 2332 BC" for AD to BC (F, M). Red "THOUGH YOU HAVE LEFT!" spam, garbled red ILLEGAL ARGUMENTS, and the screen clears at EXECUTION (F). Commenters spot a "# WHY IS THIS IN PYTHON" gag at the tabby cat and LobCorp/Arknights easter eggs (C).
  - **JavaScript:** a browser page typing the official code with lyric subtitles (D, F).
- **Covers whose MV is one illustration plus code (#13, #17).**
  - **DAZBEE:** the official GodDrinksJava code scrolls over RDR's lavender-haired android illustration, and her **eyes change from blue to red** in the last seconds (F).
  - **jeminix2:** a girl with **power-symbol pupils** presses a hand to **cracked glass**, Python code scrolls, and a "Loading…" bar counts up. At EXECUTION, `world.run_execution()` lines stack in green (F).
- **Miku / suzie (#16).** Slow pans across one Miku illustration, with **thin kinetic keywords** ("LIMITATIONS", "to A.D", "so deeply", "SATISFACTION", "EXECUTION", "SIMULATION"). The image drops to **greyscale at "AC to DC"** (F).
- **Cweamcat (#15).** A pink anime girl with **heart pupils**, chains, red vines, and **retro OS windows typing the lyrics**. "And we can unite" is **repeated in stacked lines**, "So deeply" sits beside a red eye, "strange strange…" stacks with a cursor, and old CRT monitors appear (F).
- **ストグラ MV (#22).** Verse 1 shows **crowds of silhouettes with crosses and hearts** on **psychedelic thermal-colour blobs**. AD to BC is a smartphone call. SIMULATION is **CPR on a body** (the persona is a medic). **EXECUTION ×12 is an object montage, one cut-out per beat: bicycle, motorbike, AK rifle, lavender, gravestone**, while the word stacks in columns (F). The outro has a bird flying into blue and a bloodied face (F).
- **Arcaea 观赏谱 (#23).** **Arc notes trace 3D wireframe words and drawings on the note highway**: "IF I'M", "NUTRIENTS", "SWITCH", "ENTER", "I CAN", a broken-heart "DISHEARTENED", "EXECUTION", "FEM", "STUDIED", plus line figures (F). Bilibili also has Rotaeno and Deemo fan charts that "hide lyric puns" in note patterns (T).
- **Emoji version (#24).** An emoji-headed 3D man with huge red kinetic type and VHS glitch. **Clocks for AD to BC and "switch my role"**, an eggplant emoji over "NUTRIENTS", a tabby-cat emoji. **An iOS dialog "Delete 1 item? YOU HAVE LEFT"**. The outro has Roblox-like figures (F).
- **SIMULATION grad short (#26).** A cyan 2D anime story. A **dossier card "Number 0-223 / Status: Dangerous / Host suggestion: kill immediately"**, a **sniper scope on EXECUTION**, a bracelet, holding hands, a glowing cube for "only god", and vertical lyrics in the letterbox (F).
- **sasa (#29).** A white-haired boy, a **red cube as his heart or core**, **Earth pinched between his fingers and eaten**, a halo at "only god", and blood (F).

---

## 4. Synthesis: common tropes per lyric

Counts are over the ~20 works with frame-level evidence (#1–#26).

| Lyric | What most MVs do (dominant tropes) | Notable variants | Rare or never seen |
|---|---|---|---|
| **Intro: power line → PROTECTION → OBJECT CREATION → INITIALIZATION → SIMULATION** | **Boot sequence**: a ⏻ icon, loading/progress bars, POST/BIOS text, lyrics typed in monospace, dark screen, white flash on SIMULATION (#1, 4, 9, 10, 11, 12, 17, Ing Multi). | Physical plug and CRT (#6). Game-world map coming online (#2, 7). Moon-phase ring as gestation (#5). City crowd waiting at a red light (#3). A "protection layer" toggle (#10). | PROTECTION as **real safety gear or ritual**; "lay down your pieces" as an actual board game (only a single chess-pawn shot in #5); an electrical-engineering-accurate power line. |
| **Title card** | **Monospace or thin-sans "world.execute(me);"** with RGB glitch. The **Eodslv stacked layout** ("world." small / "execute" big / "(me);" small) is copied (#1, 7, 14). | A Dunhuang caisson (#5), a spark and launch command (#10), a CLI prompt (#11). | The title **physically built** (blocks, light, handwriting); who types it, AI or user, as a plot point. |
| **Set of points → DIMENSION** | **Particles or point clouds** (#4, 9, 10, 11, 12). | Halftone or ASCII silhouettes (#2, 7). Paint drops or ink dust (#3, 5). A sweeping white plane (#1). | Points becoming a **line → plane → volume** step by step (only #10 grows edges); **fractal dimension**. |
| **Circle → CIRCUMFERENCE** | **A circle drawn or traced**, often a ring with type on it (nearly all). | `C = 2πr` (#9); "CIRCUM" lettered round the ring (#10); a cell with a nucleus (#3); the LobCorp disc (#2). Elsword MAD drew a diameter and got mocked (C). | **Unrolling the circle into a line of length 2πr**; ring/orbit/embrace as "giving" a length. |
| **Sine wave → TANGENTS** | **A sine drawn**: oscilloscope (#7), ASCII (#12, C#), particles (#4). | A **tangent line drawn on the wave** (#10, #11, Ing Multi); a cursor or block "sitting" on it (#10, #11); a silhouette sitting on an arc (#25). | A **character literally sitting and sliding along tangents**, as playful choreography. |
| **Approach infinity → LIMITATIONS** | The **∞ symbol** (#4, 6, 7). | **lim notation** (#2: lim X→∞ = Angela). Context window as limit (#9). Stop button as limit (#10). Asymptote graph (#10). Floating-point limits (#11). | Zeno / Achilles; horizon line; two hands that never quite touch. |
| **AC to DC** | A **UI toggle or slider** (#1, 10). | Square or sine waves (#4); a **bridge-rectifier schematic** (#11); greyscale flip (#16). | Hair-raising shock, lightbulb flicker, physical current. |
| **Blind my vision / so dizzy** | A **warning dialog plus blur/vignette or spin** (#1, 4, 7). | Vision toggled OFF (#10, C#). Hands over eyes (#5). Falling bodies (#3, 7). Psychedelic swirl (#22). Giant ASCII "blind" (python). | A first-person POV going dark. |
| **A.D. to B.C.** | A **timeline slider scrubbed backwards** (#1, 4, 10). | Historical architecture silhouettes (#10). "78 BC" (#9). Babylon 2332 BC (C#). A filmstrip of history (#6). Clocks (#24). Ctrl+Z undo (南辰燏炚). | Watching **world footage rewind** (ruins re-forming, starlight); geological strata. |
| **Unite so deeply** | **Two figures facing or merging**, or one absorbed into the other (#2, 3, 5, 10). | Bold type "AND WE CAN UNITE" (#25); stacked repeated lines (#15). | Two waveforms phase-locking; a circuit closing. |
| **STIMULATIONS** | **Progress or percentage bars** (#1, 25, Ing Multi), a bolt or flash (#10). | Matrix rain with a sweeping beam (#4). | — |
| **SATISFACTION / make you happy** | **Satisfaction as a metric**: a 100% bar, the **Feeling Index Happy=1** (#1, 14), the **👍 rating button** (#9 RLHF, #10). | A contoured apple (#5); an ASCII heart conditional (#12). | Showing what actually makes "you" happy. |
| **EXECUTION (chorus)** | **The word explodes in RGB glitch** or giant red type (#1, 9, 24, Ing Multi). The character's **eyes open or turn red** (#2, 13). | The code loop (#10); the apple with `requestExecution` (#7). | — |
| **Strange SIMULATION / trapped** | **Wireframe cube or box** (#1, 4, 29, Ing Multi). | **Windows inside windows** (#10); a monitor in a dark room (#8). | — |
| **Eggplant → NUTRIENTS** | **A literal eggplant** in icon, illustration, particles, emoji, or 3D (almost every non-fandom MV). | Nutrition-label infographic (#1); **molecules extracted** (#10); `instanceof Eggplant` code (#8, official); the character who likes eggplants (#2). | **Cooking or feeding** someone; the *giving* is almost never shown. |
| **Tomato → ANTIOXIDANTS** | **A literal tomato** (whole, sliced, or juiced). | `generate('a tomato', seed=me, for=you)` (#9); lycopene/vitamin molecules (#10); a blender (#6). | — |
| **Tabby cat → ENJOYMENT** | **A cat icon or silhouette**, or **cat ears on the character** (#2, 10). | A thumbs-up "liked" (#1); ImageNet class 281 (#9); a giant cat eye (#3). | The **purr as a vibration** that pays off at "VIBRATIONS" later. |
| **Only god → EXISTENCE** | **Halo, sun-rays, or radiant glory** (#2, 4 Eye of Providence, 5 Madonna, 6 Atlas, 10 sun behind void face, 29). | Static screen with "setting world.exe" (#1). | **Proof as QED / cogito**; a dependency arrow (god depends on worshipper). |
| **F to M** | **♀ → ♂ glyphs** or a "Gender" setting (#1, 2, 10, official `toggleGender`). | Flipped bits (#9); teal/red bars (#3); nude pair (#5). | Typography or font-weight switching as gender; voice-pitch visual. |
| **AM to PM** | **Clock dial** (#1: ♂♀ glyphs become the hands; #24). | A sun-arc slider (#10); a sexual silhouette (#3). | Time-lapse of a shared day. |
| **S to M** | **Veiled BDSM iconography**: crown and whip (#1), syringe (#2), redaction bars (#7), a role switch (#10). | **Chat-template system/user role swap "M→S"** (#9). | Choreographed power reversal (dance or puppetry). |
| **The trance** | **Spiral or loop**, or hypnotic orbit (#9, 10), padlock unlocking (#1). | Blood-red veins (#4); anatomical heart (#5). | — |
| **VIBRATIONS** | **Waveform, ECG, or oscilloscope** (#1, 12). | Trembling typing dots (#10); talons (#3); heart in chest (#2). | — |
| **COMPLETION** | **Gears or a progress bar completing** (#1, C#). | Petals closing into a ring (#10). | — |
| **"You have left" ×5** | **A door, a departure, or an online→offline status**, one beat per repeat (#1 doors with ⊘, #2 silhouette fading, #3 bird walking off, #5, #6 doorway, #10 timestamps and presence chip, #12 CONNECTION LOST). | Pixel walls closing (#4); iOS delete dialog (#24); "server busy" (#9); red error spam (C#). | **Physical traces of absence** (dust, an unwatered plant, seasons outside the window). |
| **ISOLATION** | **A lone figure or empty frame**, ⊘ (#1, 2). | A speck in the dark (#10); boxed in (#4). | — |
| **Erase pointless FRAGMENTS** | **Delete or trash UI** (#1, 5, 10). | Tetris line clears (#4); a hard-disk drive (#6); a glyph-button grid (#3). | — |
| **DISHEARTENED** | Big type, a BSOD, an "undefined" emotion (#1, 10). | A knife (#6); broken-heart arcs (#23). | — |
| **Challenging your god → ILLEGAL ARGUMENTS** | **An error dialog, red, and `IllegalArgumentException` or "Access Denied"** (#1, 9, 10, 12). | Pinocchio, i.e. lies (#2); sunset over a pixel city (#4); a giant red disc (#3). | **The pun on "arguments" (function arguments vs a courtroom argument)**: no trial staging seen. |
| **Instrumental bridge (2:14–2:27)** | Error cascade or "emergency protocol" text (#1, 10). | **The character's monologue as a chat log** (#2, Angela). Mandala (#5). Crystal (#7). | Treating it as **silence or breath**, a real story beat. |
| **EXECUTION ×12** | **Repetition made visible**: stacked log lines (#1, 17), a while-loop counter (#10), a beat-counting row of squares (#4). Strobing red, with flash warnings on #10, #11, #26. | **Object montage, one object per beat** (#22). Sniper scope (#26). A dark stage (#6). Mandala pulse (#5). | **Restraint**: one long take, or silence-like minimalism, instead of strobe. |
| **EIN DOS TROIS NE FEM LIU** | **Numerals or a countdown** ("ANNOUNCE" #1, a "3" #4). Most **ignore that the six numbers are in six languages** (German, Spanish, French, Korean, Swedish, Mandarin, per C). | One call per language with "replies 0 of 6" (#10). Language words in type (#24). | **Six scripts, six places, six voices or phones**. |
| **Final chorus** | **Reprise of chorus-1 imagery, corrupted** (#1 "stable" grid and RECOVER UI; #10 reprinted broken plates). | Eyes turned red (#13); the world is the execution target (#9). | — |
| **Outro: studied / answer all / algebraic expression / free vs trapped / LOVE** | **"LO-O-OVE" in red or pink with stutter-glitch** (#2, 10, 22). **Heart shapes**, often a **plotted curve or 3D heart** (#1, 10, 12). **Learning or exam metaphors** (#8, 9, 10, official `learnTopic` / `takeExamTopic`). | Softmax formula (#9). Q&A list where every answer is the same word (#10). **Weights released under MIT** = freedom (#9). | Making the free/trapped asymmetry **spatial** (the user literally walks out of frame while she stays) is only done abstractly (#10's tangent exit). |
| **Ending** | **Power-off or reverse boot**, bookending the intro (#1, 4, 8, 10, 11, 12). | Laptop reveal (#4); dark-room monitor (#8). | — |

**Global patterns**

1. **Two families dominate.**
   - **(a) UI/HUD/code motion graphics**, descended from the official code and Eodslv. This family is now industrialised by the 2026 AI-coded wave.
   - **(b) Fandom 手书**: map a game or OC cast onto the "AI who loves a user" story. LobCorp/Angela, Arknights, Undertale, Genshin, NieR, and SCP-079 are the recurring hosts.
2. **"You" is almost always faceless.** It's a cursor, a silhouette, a door, or an offline chip. Only fandom 手书 give "you" a face, borrowed from canon.
3. **Literal objects for verse 2.** Eggplant, tomato, and cat are depicted literally almost everywhere. The bodily, sexual verse (pre-chorus 2) is handled with coded icons.
4. **The EXECUTION section strobes.** Several AI-wave MVs carry photosensitivity warnings.
5. **Red is the universal "error / love" colour**, and it is usually held back until chorus 2 or EXECUTION. #10 makes this an explicit rule ("first red in the film").

---

## 5. Under-explored / fresh visual opportunities

Ranked by how open the space is and how well each fits the song.

1. **Give "you" a life outside the window.** Nearly every MV stays on the AI's side of the glass, and the 2026 wave hard-codes the user as a cursor (#10 says this outright). A split POV could show the person who left: why they left, and the slow physical traces of absence during "you have left" ×5 (dust, a phone face-down, seasons in a window). This is fresh and adds dramatic irony.
2. **The courtroom pun.** "Challenging your god / ILLEGAL **ARGUMENTS**" followed by **EXECUTION** reads as a trial and a sentence. No examined MV stages it. Only the Niconico MAD title "world.execute(witch);" (sm45353382, a *Manosaba* witch-trial MAD, T) hints at it. The JP subtitle's shift from 実行 to 死刑 or 抹殺 already invites it.
3. **The verse-2 "giving", made physical.** Everyone draws a lone eggplant or tomato. Almost nobody shows **feeding, cooking, or setting a table**, and #10 only alludes to it with a "What can I cook for one?" question. A recipe that carries through to "you have left" (a meal going cold) would pay off.
4. **Math done as true visual poetry.** Ideas nobody has used:
   - **unrolling a circle into its circumference**
   - **Fourier epicycles summing sine waves into the heart curve**, which would tie the verse-1 sine to the outro "algebraic expression"
   - **fractal or Hausdorff dimension** for "set of points"
   - **Zeno** for the limit

   FrostNova (#11) and #10 do accurate math, but neither does these.
5. **Multilingual EIN DOS TROIS.** Six numbers in six languages, and only #10 treats them as six attempts. Six scripts, six handwritings, six cities and time zones could callback "AM to PM", or six unanswered calls.
6. **A purr → vibrations callback.** Make the tabby cat's purr the literal vibration the AI later tries to feel (1:46). No MV links these two lines.
7. **Restraint at EXECUTION ×12.** Every major MV strobes or stacks text. A **single long take, near-stillness, or one object per beat** (like ストグラ's object montage, but symbolic: twelve objects from "your" life) would stand out and avoids photosensitivity problems.
8. **The instrumental bridge (2:14–2:27) as a story beat.** Only mochimikan gives it real narrative weight, through Angela's dialogue. Most fill it with error noise.
9. **Non-digital materials.** Paper cut, clay or stop-motion, embroidery, shadow puppetry, Dunhuang mural, or ink wash. Only #5 (Dunhuang/ink) and #3 (painterly minimalism) leave the screen aesthetic, and both are 2D-digital.
10. **The "God Drinks Java" joke.** The official code's class name has never been visualised (coffee, Java the island, steam turning into code). It's a light easter egg for programmer fans.
11. **Dance or choreography.** Only small MMD and one Niconico dance-cover exist, and #9 has an ASCII dancer. A choreographed role swap could carry pre-chorus 2 tastefully, and it fits a personified-character production.
12. **Rhythm-game literalism.** Notes drawing words (Arcaea #23) and osu! sprites (#4) show the song works as a "playable" visual. An MV that pretends to be a rhythm game the AI plays for "you" is untested outside games.
13. **"LOVE = ア・イ (A.I.)".** The Japanese subtitle pun is cited by fans but never made visual. Letters A and I could rearrange into 愛 at the final LO-O-OVE.
14. **Mili lore easter eggs.** The number **617** in the code's `timeTravelForTwo("AD", 617, …)` also appears in *Ga1ahad and Scientific Witchery* ("page 617", C). There's also the sibling song *world.search(you)*. Lore-hunters notice these, and no MV uses them.

**Already saturated; avoid or subvert (Sept–Oct 2026)**

- chat window or terminal as "her whole world"
- "X's eyes" framing
- personified-LLM mascot with the user as cursor
- presence chip online → offline
- `IllegalArgumentException` stack trace
- context window as the limit
- RLHF 👍 as SATISFACTION
- token or frame-count boasting

See #9–#12, 南辰燏炚, 查理, SeASnAkEss, and roughly 100 GitHub repos.

---

## 6. Well-known visual memes and community lore

| Meme / motif | What it is | Evidence | Conf |
|---|---|---|---|
| **Lyrics as runnable code ("GodDrinksJava")** | The official PV's Java program, `goddrinksjava.GodDrinksJava`, with one method per lyric. Fans port it to Python, C#, TypeScript, Rust, Godot, and HTML. "As a programmer…" comments and "the closing bracket at the end" are the standard reactions. | Gist by hibiyasleep; repos daun-io (2018, 152★), DeflatedPickle/GodDrinksJava, UM7lab, Kritzkingvoid; official comments | H |
| **The Eodslv look** | The ⏻ boot icon, loading bars, the **Feeling Index table**, **♂♀ glyphs becoming clock hands**, the door filmstrip, the triangle-mesh heart. Reused or imitated by covers and 手书. | #1 frames; #7, #14, Zae, Ing Multi | H |
| **Angela / Lobotomy Corporation** | The fandom's canonical "AI who loves her creator" reading. mochimikan's MV made Project Moon recruit Mili (Ruina and Limbus OSTs). Many LobCorp and Angela fan works, plus a "Limbus canto final boss" remix (27k). | Mili Wiki; #2; #25; YouTube zqMoshb9Kvs | H |
| **Yandere AI (病娇)** | Bilibili tags, plus titles like "病娇力爆表 'kill the whole world and we'll be together forever'" (702k). Heart pupils and chains (#15). | Bilibili search tags and titles | H |
| **EXECUTION's double meaning** | Run vs kill. JP subtitles switch 実行 → 抹殺 / 死刑, and the Chinese title is often "世界.执行/处决(我)" ("execute / put to death"). | Official comments; #2 subtitles; Bilibili titles | H |
| **"ア・イ" = LOVE = A.I.** | The JP subtitle writes LOVE as ア・イ. | Official comments; #2 frames | H |
| **EIN DOS TROIS NE FEM LIU = six languages** | Explained in top comments and mapped to `world.announce(n, "de")…("cn")`. | Comments on #1 (1.1K likes) and the official video | H |
| **The algebraic heart** | Usually a plotted or 3D heart, or a formula (softmax in #9). A specific equation is rarely named. | #1, #9, #10, #12 frames; no source names a canonical equation | M |
| **Title-parody format "world.execute(X);"** | e.g. world.execute(witch), world.oruyanke(me), world.execute(sprunki), world.execute(ayumu), world.execute(Command Prompt), World.execute(Google) (204k Google-Translate meme). | Niconico and Bilibili titles | H |
| **Sound-remake MADs ("原曲不使用")** | The song rebuilt from Windows system sounds (1.1M) or Minecraft sounds (31k). | Bilibili | H (existence); visuals unknown |
| **AI singers singing the AI song** | 星尘Infinity "let an AI diva sing a song about AI" (1.3M), Neuro-sama (823k YT), sovits AI covers of game characters (Nahida 920k, Fairy 988k). | Bilibili, YouTube | H |
| **"Let model X make the MV" (2026)** | A benchmark-style trend: GPT-6 Astra → Opus 5.5 → DeepSeek V4.1 Flash, MiMo, Kimi, 豆包. Hype titles (眩晕瘫坐 "dizzy and collapsed", 核弹 "nuke") and token-count bragging; Bilibili event tags. | Bilibili search; GitHub (138 repos) | H |
| **Portal/GLaDOS comparison** | Commenters liken the voice and premise to Portal 2 turrets and GLaDOS. | Comments on #1, #8, #17 | M |

**Mili's rules for our production** (https://projectmili.com/copyright-guidelines):

- Non-commercial derivative works are allowed without contacting Mili.
- **AI-generated or AI-assisted content must be clearly labelled.** Mili states a preference for human-made works.
- Don't present a work as official.

The AI-wave MVs all carry this label (D).

---

## 7. Gaps and unknowns

- **Unverified Japanese works.** No frames for Niconico-only works: FRENZ2017 motion graphics, ちいましゅ's 2017 手描きMV, and the Niconico dance cover. Their per-lyric content is **unknown**.
- **Reddit inaccessible.** No Reddit threads could be read, including r/mili's "song analysis" thread linked from the Mili Wiki (reddit.com/r/mili/comments/sgkeor).
- **Josephine Anna Wall's shader piece.** Only the festival blurb was found. Visuals **unknown**.
- **Nightcore uploads** (e.g. YT L8_pJTJX_Rw, ym92FFrFF5Y) were not examined. They typically use one static anime image (L, general knowledge, not verified).
- **Sample rates.** Bilibili frames are ~5–6 s apart, so profiles #3, #5, #6, and #7 can miss fast cuts. Their lyric mappings are approximate.
- **Eodslv tomato and infinity shots** fell between 2 s samples. Treat those rows as M.

---

## 8. Sources (all accessed 2026-10-14)

**Official and reference**

- Mili, official PV: https://www.youtube.com/watch?v=ESx_hy1n7HA (Bilibili BV1ds411e7df)
- Mili Wiki, world.execute(me);: https://mili.wiki.gg/wiki/World.execute(me)
- Code transcription gist (hibiyasleep): https://gist.github.com/hibiyasleep/519a7bd3bfc2fd4f7d33f3cbf5cdc3bb
- Mili copyright guidelines: https://projectmili.com/copyright-guidelines

**Deep-profile works**

- #1 Eodslv FMV: https://www.youtube.com/watch?v=cn4M-fH08XY · https://www.bilibili.com/video/BV1sx411C75U
- #2 mochi mikan: https://www.youtube.com/watch?v=sNZUo2Oy3KQ · https://www.nicovideo.jp/watch/sm32141350
- #3 sowiti: https://www.youtube.com/watch?v=52pa7rj5zrs · https://www.bilibili.com/video/BV1b34y1v7ra · https://www.bilibili.com/video/BV1mb411H7Fa
- #4 osu! storyboard: https://osu.ppy.sh/beatmapsets/470977 · https://www.youtube.com/watch?v=OnO46zjqvPA · https://www.youtube.com/watch?v=fuExKADMtjw · https://www.youtube.com/watch?v=vduOWtkPH-M
- #5 穗穗青梅酒: https://www.bilibili.com/video/BV18a411x74d
- #6 HnDonmen: https://www.bilibili.com/video/BV1hg4y1p7cm
- #7 林朝雪: https://www.bilibili.com/video/BV1zETQz2E3X
- #8 ALTUM: https://www.youtube.com/watch?v=hO_smg7QrV0
- #9 MisakaZentai: https://www.bilibili.com/video/BV1xCai6aE9g · https://www.youtube.com/watch?v=3VwhU_N0rAY · https://github.com/MisakaZentai/world-execute-me-dsh-pv
- #10 真寻Mahiro / Nyankomintsu: https://www.bilibili.com/video/BV186pc65E68 · https://github.com/Nyankomintsu/world-execute-me-lyric-mv (STORYBOARD.md)
- #11 FrostNova: https://www.bilibili.com/video/BV1SgaY64EG5 · https://www.youtube.com/watch?v=6E4KygeYxqY · https://github.com/FrostNovaOrg/world-execute-web
- #12 野生大K: https://www.bilibili.com/video/BV1Jwhy6BEMJ

**Other works cited**

- DAZBEE https://www.youtube.com/watch?v=9DO79KC_qoE
- 星尘 https://www.bilibili.com/video/BV1Lc411K7Fr
- Cweamcat https://www.youtube.com/watch?v=u6nXqTAaoYQ
- suzie/Miku https://www.youtube.com/watch?v=MKWCvla3OWM
- jeminix2 https://www.youtube.com/watch?v=CIk-nWM_gT0
- Neuro https://www.youtube.com/watch?v=xsc3Z53QTC0
- python3 https://www.youtube.com/watch?v=OnWktOJHrjQ
- C# https://www.youtube.com/watch?v=zRiQPLrHOfw
- JavaScript https://www.youtube.com/watch?v=SaeVrmM3rf0
- ストグラ https://www.youtube.com/watch?v=zZJl9uRH0zM
- Arcaea 观赏谱 https://www.bilibili.com/video/BV1nE411Q7MG
- Emoji https://www.bilibili.com/video/BV1fcSEBMEoN
- Angela 手书 https://www.bilibili.com/video/BV1qN411t7qF
- SIMULATION https://www.bilibili.com/video/BV1Tf421z76m
- sasa https://www.youtube.com/watch?v=xfJYHqto8Os
- Ing Multi https://www.youtube.com/watch?v=a5-9uK6rqGw
- Elsword MAD https://www.youtube.com/watch?v=dwidQ03OAzU
- Zae Lore MV https://www.youtube.com/watch?v=FixLUU9cPKE
- Limbus-style extended https://www.youtube.com/watch?v=zqMoshb9Kvs
- FRENZ2017 https://www.nicovideo.jp/watch/sm31965523
- ちいましゅ https://www.nicovideo.jp/watch/sm30587344
- Josephine Anna Wall https://www.labiennale.org/en/node/8672
- 南辰燏炚 https://www.youtube.com/watch?v=xZVxKGlodH0
- 查理 https://www.youtube.com/watch?v=iEsGiRECytY
- GPT-6 Astra (Kyle Marshall) https://www.youtube.com/watch?v=TzVsVrT_yqc
- PixelMeteor https://www.youtube.com/watch?v=JSZeqmeYyDw

**Search and metadata tools**

- YouTube results and watch pages, including seek-bar storyboard sprites
- Bilibili search API (`/x/web-interface/search/type`) and `videoshot` sprites
- Niconico snapshot API and `getthumbinfo`
- GitHub search API (repos matching "world.execute me")
