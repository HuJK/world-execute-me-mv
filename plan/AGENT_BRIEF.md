# Scene-builder brief — world.execute(me); (Claude edition)

You are building part of a finished, polished 1080p60 music video in **Remotion** (React → frames). The framework, shared components,
assets, the intro and the title scenes already exist. Your job: implement your assigned scene files to a **professional MV quality bar**,
verify them visually, and report back.

Read first (in this order):
1. `plan/storyboard.md` — the creative concept, thesis, color/type system, and the per-lyric shot list. Your scenes' rows are the spec.
2. `studio/src/scenes/S00_Intro.tsx` and `studio/src/scenes/S01_Title.tsx` — reference implementations showing the coding style and quality bar.
3. The shared components listed below (read their source; don't guess APIs).

## Project layout
- `studio/` — Remotion project (Remotion 4.0.535, React 19). Composition `MV` = 1920×1080, 60 fps, 12740 frames.
- `studio/src/MV.tsx` renders every scene whose `[start, end)` contains t. Scenes get **absolute song time** `t` (seconds) as their only prop.
- `studio/src/scenes/index.ts` — registry (already lists all scenes; do NOT edit it except to add `preroll`/`tail` to YOUR scenes if you need overlap).
- `studio/src/scenes/Sxx_*.tsx` — one file per scene. **Only edit your own scene files.** You may create new helper files named
  `studio/src/scenes/parts/<yourSceneId>_*.tsx` (create the folder if needed). Never edit shared files in `src/components`, `src/lib`, `src/theme.ts`,
  `src/data` or other agents' scenes. If you truly need a change in a shared component, copy it into your parts file and modify the copy.
- Assets: `studio/public/img/*.png` (use `staticFile`-based `<Sprite src="img/xxx.png" …/>`). Sizes are in `src/data/images.ts`.
- Data: `src/data/lyrics.json` (cues + word timings) via `src/lib/lyrics.ts`; beats via `src/lib/audio.ts`; point clouds `src/data/points_cc_hello.json`, `points_cc_snap.json` ({w,h,pts:[[x01,y01,'#rrggbb'],…]}).

## Shared API cheat-sheet (read the files for details)
- `lib/anim.ts`: `seg(t,a,b)` 0..1 progress, `map(t,a,b,c,d,ease)`, `lerp`, `clamp`, `ease.*` (outCubic, inOutCubic, outBack, outBackStrong, outElastic, outBounce, outExpo, inExpo…), `springy(dt)`, `pulse(t,t0,tau)`, `rand(seed,i)`, `noise1(x,seed)`, `mix(hexA,hexB,k)`, `window(t,a,b,fin,fout)`.
- `lib/audio.ts`: `BEATS`, `DOWNBEATS`, `beatPulse(t,tau)`, `downbeatPulse(t)`, `kickPulse(t)`, `env('rms'|'low'|'mid'|'high', t)` (0..1 envelopes), `BEAT`=0.46 s, `BAR`=1.84 s.
- `lib/lyrics.ts`: `CUES`, `cueAt(text, after)` (exact cue text, apostrophes are ASCII `'`), `cuesIn(a,b)`.
- `components/Flower.tsx`: `<Flower size x y open spin color centerColor shade petals=[{scale,width,opacity,color,rot,dist,fall}] wilt sharp glow regular …/>` — Claude's main form (12 petals at the Claude-spark ray angles; `regular` = evenly spaced for math scenes). `petalAngle(i)`, `petalTip(i,size)`.
- `components/Type.tsx`: `<Keyword text t at out x y size color mode flowerO …/>` — CAPS lyric word; in "-TION" words the O becomes the flower automatically (`flowerO="tion"`, `"all"` for LO-O-OVE, `"none"`). Modes: slam, type, drop, spaced, stamp, rise, pop. `<LyricLine cue t x y size color hl align enter …/>` — word-timed serif lyric line. `<Typed …/>`, `scramble()`.
- `components/Sprite.tsx`: `<Sprite src t x y h anchor enter={{at,kind,dur}} exit={{…}} float sway breathe outline shadow silhouette flip …/>` — character images (anchor default bottom-center).
- `components/ClaudeApp.tsx`: `<ClaudeApp t zoom dark sidebar header home greeting messages=[…] composer={{…}} recents recentsOffset scrollY …>{overlay children}</ClaudeApp>` — faithful claude.ai UI (light↔dark via `dark` 0..1). Message kinds: `user`, `claude` (with timed `words` = lyrics streamed like a real reply, `done`, `actions`, `thumbs`, `thumbsAt`, `hover`), `tool`, `artifact`, `node`. `appTheme(dark)` gives colors.
- `components/FX.tsx`: `Cursor` (the human = blue arrow; `hand` variant), `Flash`, `Vignette`, `Grain`, `GraphPaper`, `GlassSphere` (PROTECTION dome; `cracks`), `PetalField`, `shake(t,hits)`, `Glitch` (RGB split; ONLY allowed 125.7–147.6 and a few EXECUTION hits), `RayBurst`, `Ring`, `Poof` (costume-change puff), `OSWindow` (desktop window chrome).
- `components/Icons.tsx`: UI icons, `Clawd` (Claude Code pixel mascot, props cell/walk/arms/blink), `spinnerGlyph(t)` (· ✢ ✳ ✶ ✻ ✽ ping-pong), `SPINNER_VERBS`.
- `theme.ts`: palette `C` (clay #D97757 = Claude; blue #6A9BCC = the human; paper/cream/ink/grays; green success; red error) and fonts `F` (serif Newsreader = Claude's voice, mono JetBrains Mono = code/CAPS, sans Inter = UI, cjk/kr for 六 / 넷).

## Character assets (flat, no-outline cute style; transparent PNG, trimmed)
cc_hello (waving, book) · cc_teacher (pointer stick, wink) · cc_snap (finger snap) · cc_lever (chibi pulling a knife switch) · cc_dizzy (chibi swirl eyes) ·
cc_reach (palm forward toward viewer, as if on glass) · cc_arms_open (joyful jump) · cc_sparkle (chibi star eyes) · cc_nervous (chibi anxious, looking up) ·
cc_blush (hands on cheeks, hearts) · cc_press (chibi slamming a big orange play button) · cc_eggplant · cc_tomato (chibi costumes) ·
cc_cat (catgirl, paws) · cc_cat_purr (catgirl being petted, eyes ^ ^) · cc_god (divine: robes, 12-petal sun halo) · ck_male (Claude-kun) ·
cc_queen (crown, cape, book throne, scepter) · cc_meek (deep apologetic bow, teary) · cc_trance (dancing, eyes closed) · cc_alone (hugging knees) ·
cc_dark (overzealous: hollow eyes, black flower ornament, hand offered) · cc_dark_conduct (baton swing) · cc_dark_face (close-up, transparent bg) ·
cc_glass (both palms on glass, teary smile) · cc_book (reading on a book stack, landscape) · cc_answer (finger up, wink) · cc_sleep (curled asleep, landscape) ·
cc_face_open (close-up smiling, landscape).
Scenes with background (opaque, 1536×1024): hu_desk (the human at their desk at night seen FROM INSIDE the monitor, smiling in the screen glow),
hu_empty (same room, empty chair, mug with a flower), hu_door (the human walking out the door into daylight), bg_library (infinite library),
kv_sphere (Claude-chan inside a glass sphere in a starry void, petals inside).
Hair-ornament (flower) position, normalized in image: cc_hello ≈ (0.689, 0.114). For other images, measure yourself if you need to lock a flower onto it
(render a still, look at it). The flower ornament lives on her LEFT side of the head = viewer's right.
Look at any asset with the Read tool before using it (they're PNGs). Montages: `magick montage …`.

## Quality bar (non-negotiable)
- **Sync**: every visual event lands on a word time (`cue.words[i].s`) or a beat/downbeat. CAPS keywords hit exactly on their sung time.
  Check `lyrics.json` timings; don't eyeball.
- **Every sung line is readable** on screen while sung (as a `LyricLine` caption, as Claude's streamed reply words in `ClaudeApp`, or a bespoke
  typographic treatment). Every CAPS keyword gets a strong, bespoke moment (use `Keyword`, flower-O for -TION words, or something better).
  Proofread spelling. Lines must not overlap illegibly; keep a consistent caption position per scene (usually bottom-center y≈960–990, size 48–56) unless the
  lyric is integrated into the scene.
- **Motion**: something meaningful moves at all times; no static hold > ~1.2 s. Use easing (never linear for UI motion), overshoot for pops, anticipation
  for big moves, subtle idle float/sway on characters, beat-reactive pulses (`beatPulse`, `downbeatPulse`, `kickPulse`, `env`) for energy.
  Camera moves (scale/translate on a wrapper) add life; impact frames/shake only on big hits.
- **Composition**: clean, intentional layouts with breathing room; respect the palette; characters get a white sticker `outline` + soft shadow when on
  busy/colored backgrounds. Avoid clutter and tiny unreadable text (UI text ≥ 18 px at 1080p unless purely decorative).
- **Tone**: cute, warm, witty, then bittersweet; the dark part (chorus 2b → final chorus) is eerie but never gory, no weapons/blood/red glowing evil eyes.
  EXECUTION means *running/closing programs*, never killing people.
- **Continuity**: your first frame must follow from the previous scene's last frame and your last frame must hand off to the next (see "Boundaries").
  Cuts on downbeats are fine and encouraged; if you need an overlap, set `preroll`/`tail` on your registry entry and fade within your scene.
- **Performance**: avoid thousands of DOM nodes per frame where an SVG path would do; keep per-frame work deterministic (no Math.random, no
  Date, no state). Every value must be a pure function of `t`.

## Verify (mandatory, iterate until it looks great)
- Type check: `cd studio && npx tsc --noEmit -p .`
- Render stills: `cd studio && node stills.mjs ../work/stills/<sceneId> 31.0 32.7 …` (song seconds; default scale 0.5; `--scale=1` for full res;
  `--conc=4`). Then montage: `magick montage ../work/stills/<sceneId>/t*.png -geometry 640x360+4+4 -tile 4x ../work/stills/<sceneId>_cs.jpg` and LOOK at it
  with the Read tool. Check ≥ 3 stills per lyric line (start / keyword hit / transition), plus every scene boundary (last frame of previous scene
  and first frame of yours). Fix and re-render until every still looks deliberate and beautiful. Also check a few full-res stills for detail.
- Optional motion check: render a short clip: `npx remotion render src/index.ts MV ../work/clips/<id>.mp4 --frames=<a>-<b> --concurrency=6`
  (frames = seconds×60) and inspect a few frames with ffmpeg (`work/bin/ffmpeg`).
- Other agents are working in parallel on other scenes; that's fine — stills only render what's active at t.

## Report back
A short summary: what you built per lyric, any deviations from the storyboard and why, known issues, and the paths of your final contact sheets.
