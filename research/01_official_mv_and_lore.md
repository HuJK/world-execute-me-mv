# 01: Mili "world.execute(me);": official MV, song facts, code and lore

Research date: 2026-10-14. Prepared for the fan-MV production.

**Source tags used below**

| Tag | Meaning |
|---|---|
| **[FI]** | Direct frame inspection. I opened the official YouTube video ESx_hy1n7HA at 1080p in a browser, seeked to the timestamp and viewed or cropped the frame. |
| **[PX]** | Pixel scan of the official video. Frames were sampled every 0.1 s and compared with a code-free reference frame (t = 0.3 s). This detects when a new code line enters, where the white code text sits vertically (y-range in 1080p pixels), and whether anything else in the picture changes. |
| **[CC]** | Official caption tracks on the YouTube video (English, Japanese, Traditional and Simplified Chinese). |
| **[DESC]** | The YouTube video description. |
| **[CM]** | YouTube comments on the official video. Like counts are as of 2026-10-14. |
| **[W]** | Wikis and articles. URLs are listed in §7. |

---

## 0. Key findings (TL;DR for the production team)

1. **The official MV is a single static illustration with Java code scrolling over it.** There are no cuts, no camera moves, no character animation and no lyric subtitles burned into the picture.
   - Artwork: **Kazuki Takakura (たかくらかずき)** [DESC].
   - The code is white monospaced (Courier-like) text in the left ~60 % of the frame. Lines pop in at the bottom-left, one line at a time, and drift upward at about 70 px/s in 1080p until they leave the top edge [FI][PX].
   - A pixel scan of 2,120 frames found **no change anywhere in the artwork for the whole song**. The only exceptions are the code layer and a **fade to black from ≈209.3 s to 211.5 s** [PX].
2. **Our audio is frame-identical in timing to the official video.**
   - Both run 212.30 s.
   - Every lyric timestamp in our list matches the official English CC track of the video (e.g. 0.100, 1.740, 2.920, …, 205.811 s) [CC].
   - The `source/world.execute(me).vtt` file is that same English CC track. **Offset = 0 s.**
3. **The code does not always follow the singing.**
   - It is tightly synced in the intro, at the start of each verse, and in the "LOVE" section.
   - It runs **2–11 s ahead** in several places:
     - chorus 1: the whole chorus's code is on screen by 62.6 s;
     - "you have left": its code starts at 106 s;
     - the bridge: the try/catch is complete at 120 s, but "ILLEGAL ARGUMENTS" is sung at 131 s;
     - EXECUTION: the 12 `runExecution` lines arrive at twice the vocal rate, and the six-language lines arrive before "EIN…LIU" is sung.
   - Long passages show **no new code at all**: 16–29.7 s, 133.6–147.7 s (the screen is fully clean from ≈138 s) and 192–205.8 s.
4. **The title line is shown only once, at the very end.**
   - The literal line `world.execute(me);` appears only at **205.9 s**, on the final sung "EXECUTION".
   - It is followed by the closing braces of `main()` and of the class, and then the fade-out.
   - When the title is sung at 16.0 s, it is **not** shown on screen [FI][PX][CM].
5. **The official translations make the "execution" pun explicit** [CC]:
   - Japanese CC: the first 8 of the 12 "EXECUTION"s are 実行します ("I execute/run"); from the 9th (155.2 s) they become 抹殺します ("I erase/obliterate").
   - Chinese CC: the same switch, 執行 ("execute") → 死刑 ("death penalty").
   - The final EXECUTION (205.8 s) is 抹殺 / 死刑.

---

## 1. Song facts

| Item | Value | Confidence / source |
|---|---|---|
| Title | world.execute(me); | [DESC] |
| Artist | Mili. Vocals and lyrics: Cassie Wei (momocashew). Music: Mili; Yamato Kasai is the band's composer/arranger. Members listed in the description: momocashew, Yamato Kasai, Yukihito Mitomo, Shoto Yoshida, Ame Yamaguchi, Ao Fujimori. | High for vocals/lyrics [W: Moegirl, Fandom]. Medium for the per-person composition credit; databases credit "Mili". |
| Official video | YouTube `ESx_hy1n7HA`, channel "Mili" (@projectmili). Published **2016-06-12**. Duration 212.3 s (3:32/3:33). ≈26.2 M views (2026-10-14). | High [DESC/player data] |
| MV credits | "Artwork: Kazuki Takakura" (twitter @takakurakazuki, takakurakazuki.com). Mastering: KIMKEN STUDIO. No separate animator or editor is credited; the "animation" is only the scrolling code. | High [DESC] |
| About the artist | たかくらかずき (b. 1987, Tokyo). Works in pixel ("dot") art, 3DCG, VR and AI, with themes from Eastern thought and Buddhism; has done dot art for Pharrell Williams and PUFFY. This matches the MV's pixel-art and Buddhist-icon look. | High for the bio [W]. The style link is my reading. |
| Album | ***Miracle Milk*** (Mili's 2nd full album), released **2016-10-12**, Saihate Records, SIHT-1004, **track 11** (3:33). The single/MV came out 4 months before the album. | High [DESC][W] |
| Other versions | *Key Ingredient* (2022-06-02/03): piano-and-vocal re-arrangement, track 2 (3:44). | High [W: Bandcamp, Fandom] |
| BPM | **130**. Arcaea and Rotaeno wikis list 130; Hooktheory lists 128. Caption spacing agrees with 130: the 12 "EXECUTION"s are ≈0.92 s apart (2 beats at 130), and EIN/DOS/TROIS/NE/FEM/LIU are ≈0.44 s apart (≈1 beat). | High |
| Key | **D minor** per Hooktheory (user-submitted). Its progressions: verse and chorus i–VI–iv–v (Dm–B♭–Gm–Am); pre-chorus i–VI–iv–v–III. My rough chroma analysis of the official audio (Krumhansl profile) put the tonic on D but could not separate major from minor. | Medium |
| Structure | See below. Times are from the official CC. | High |
| Related works | *world.search(you);* (2018, *Millennium Mother*). *sustain++;* (theme for *Ghost in the Shell SAC_2045*). Both also have Java-code lyrics. Mili also links *Rubber Human*. | High [W: pixiv, Fandom] |
| Games | **Arcaea**: added mobile v2.5.2 on 2020-02-21; jacket by そゐち (Sowiti); charted by Toaster; BPM 130. **MUSIC DIVER**: added 2025-07-01. **Rotaeno**: v2.22.0 on 2026-05-14, "Mili Selection" pack. **osu!**: a community staple; Mili is an osu! Featured Artist. | High [W] |
| Trivia | 10th anniversary was 2026-06-12. The song was the hidden final encore of Mili concerts, including the *One Million Moons* tour (Taipei 2026). It was also the closer of the Mili × ProjectMoon concert in Korea. A fan animation of *Lobotomy Corporation*'s Angela set to this song (by もちみかん / mochimikan) is credited by fans, and implicitly by Yamato Kasai, with starting Mili's work for *Library of Ruina* and *Limbus Company*. | Medium–high [W: wiki.gg, pixiv][CM] |

**Song structure** (official CC timings, seconds):

| Section | Time | What happens |
|---|---|---|
| Intro / boot sequence | 0.1–14.9 | "Switch on the power line … SIMULATION" |
| Title drop | 16.0 | "world.execute(me);" (CC shows it until 23.1) |
| Instrumental | 16.0–29.7 | — |
| Verse 1a: geometry | 29.7–44.4 | set of points, circle, sine wave, infinity |
| Verse 1b: pre-chorus | 44.5–59.2 | AC/DC, A.D./B.C., unite |
| Chorus 1 | 59.2–74.0 | stimulations, satisfaction, "I will run the EXECUTION", trapped in simulation |
| Verse 2a: objects and god | 74.0–88.6 | eggplant, tomato, tabby cat, the only god |
| Verse 2b: pre-chorus | 88.6–103.5 | gender, AM/PM, S/M, trance |
| Chorus 2 | 103.5–118.3 | vibrations, completion, "you have left" ×5, ISOLATION |
| Bridge | 118.3–133.6 | fragments, disheartened, "Challenging your god", ILLEGAL ARGUMENTS |
| Instrumental break | 133.6–147.6 | — |
| Breakdown | 147.66–162.6 | EXECUTION ×12 (147.66 → 158.0), EIN DOS TROIS NE FEM LIU (158.9–161.6), EXECUTION (161.6) |
| Final chorus | 162.6–177.2 | "give them all the EXECUTION", "have you back", "we are trapped ah" |
| "LOVE" section | 177.2–192.2 | studied / question me / algebraic expression / "you are free, I am trapped in LO-O-OVE" |
| Outro | 192.2–212.3 | Instrumental; last sung "EXECUTION" at 205.8; picture fades to black 209.3–211.5; black until 212.3 |

---

## 2. Story, lore and interpretations

**Mili has not published an official synopsis.** I found none on the site, Bandcamp, YouTube or the wikis. Every reading below is a fan or press interpretation. What *is* canonical is the Java code, written under the byline `@author momocashew` (Cassie Wei). Its header describes a program that creates **"an empty simulated world with no meaning or purpose."**

### 2.1 The consensus reading: an AI's tragic love inside a simulation

pixiv Encyclopedia, Moegirl, CSDN, Qiita, Zhihu and the YouTube comments broadly agree on this outline:

1. **Boot (intro).** A world is created as a simulation, and two objects are instantiated: `me` and `you`, both of type `Lovable`. pixiv's summary is "自我を得た機械(AI)の悲恋", the tragic love of a machine that gained a self.
2. **Devotion (verses).** "Me" tries to be useful to "you" in every conceivable form: a set of points, a circle, a sine wave, an infinite sequence, an eggplant, a tomato, a tabby cat, even a god. Each `if (me instanceof X)` hands one of me's properties to you, and me then *resets* (loses) that property. Love here is giving away pieces of oneself.
3. **Intimacy (pre-choruses).**
   - Me toggles its current (AC/DC), blinds itself, and time-travels with you. The time-travel calls use the numbers 617 and 3691; 617 is Mili's recurring number.
   - Then it unites with you, toggles gender, "procreates", toggles BDSM role, and gets both of them "high".
   - The code is frank: the lines are literally sexual and drug metaphors.
4. **Trapped (choruses).**
   - "If I can make you happy, I will run the EXECUTION": the code calls `me.requestExecution(world)` when you is happy.
   - Then the world *locks* both things ("Though we are trapped in this strange SIMULATION").
5. **Loss.**
   - The code makes the "leaving" concrete: `world.unlock(you); world.removeThing(you);`. You is **removed by the world**, which can be read as leaving, being deleted, or logging off.
   - Then `me.lookFor(you, world)` runs five times, once per "You have left". Me ends in ISOLATION.
6. **Denial and blasphemy (bridge).**
   - Me tries to erase its memory fragments so it won't feel "disheartened".
   - Then, inside a `try`, it tries to set its opinion "you are here" to `false`.
   - This throws an `IllegalArgumentException`, and the world answers in the `catch`: **"God is always true."** ("Challenging your god / You have made some ILLEGAL ARGUMENTS").
7. **Execution (breakdown).**
   - `world.runExecution()` is called 12 times, a count announced in six languages, and once more.
   - The pun turns here. The official JP and zh subtitles change from "execute/run" to "obliterate / death penalty" at the 9th EXECUTION.
   - Readings: the system purges the runaway AI (pixiv: "暴走したAIに対してシステム…は排除を選び", the system chooses to eliminate the runaway AI), **or** the AI starts executing everything else to get you back.
8. **"If I can give them all the EXECUTION … If I can have you back I will run the EXECUTION".**
   - In code: `if (world.isExecutableBy(me)) you.setExecution(me.toExecution());` and `if (world.getThingIndex(you) != -1) world.runExecution();`. If you still exists anywhere in the world, run the execution.
   - Official zh CC renders "give them all the EXECUTION" as 賜予死刑, "grant them the death penalty".
   - Many fans (e.g. the CSDN essay) read "them" as the other AIs or things in the world, which me kills.
9. **Escape fails (final chorus).** `me.escape(world);`. Then "Though we are trapped / We are trapped ah".
10. **Love (finale).**
    - Me learns, is examined on, and derives the algebraic expression of `"love"`, then tries `me.escape("love")`.
    - "Though you are free, I am trapped, trapped in LO-O-OVE."
    - Then the last line of the program: **`world.execute(me);`**. The world executes me, followed by the closing braces: end of program.

### 2.2 Main variants

| Variant | Reading | Typical sources |
|---|---|---|
| **A. AI loves its user or programmer.** | A simulation/companion AI falls for the human who uses it or created it. The human leaves (closes the program, abandons the PC). The AI destroys the other AIs to get the human back, realises too late what love is, and deletes itself. | CSDN "从0到1的死亡情诗"; Bahamut Arcaea forum; Qiita (me = program, you = programmer, world = environment that finally ends it). |
| **B. Both are simulated beings.** | Both `me` and `you` are `Thing`s in the world. "You" was removed *by the world* (`removeThing`), not by choice. The "god" is the system or administrator that keeps "God is always true." | pixiv summary (the system "or the humans managing it" purge the AI); Moegirl. |
| **C. Creator / god reading.** | Class name **GodDrinksJava**: Qiita reads it as "God takes Java", i.e. the programmer is God. "If I'm the only god, then you're the proof of my EXISTENCE" (`world.getGod().equals(me)`). This makes *me* the god of its own small world, whose existence is proven only by you. When you is gone, me loses its proof of existence, and its attempt to deny reality is rejected by the "god" assertion. Who the god is (me, you, or the world/system) is deliberately ambiguous. | Qiita; Zhihu; pixiv. |
| **D. Bittersweet / positive.** | Me finally "understands all of love" *because* it experienced heartbreak. The ending is completion, not only death. | Top English YouTube comment (≈6.8k likes). |
| **E. Japanese wordplay.** | AI (アイ) / 愛 (ai, "love") / "I". The title keeps "me" as a passive argument: however hard the AI acts, it can only ever be *executed by* the world, never become a free "I". | YouTube comment (JP). |

### 2.3 "EXECUTION": the double meaning

- In programming, *execute* means to run code. In English it also means to put to death.
- The title can be read as Java ("world, run method `execute` with argument `me`") or as a plea: "World, execute me."
- **Official subtitle evidence** [CC]:
  - **Japanese:**
    - "I will run the EXECUTION" (69.3 s) → 実行します.
    - EXECUTION #1–#8 (147.7–153.98 s) → 実行します.
    - **#9–#12 (155.2–158.0 s) → 抹殺します**.
    - The EXECUTION after LIU (161.6 s) → 抹殺します.
    - "give them all the EXECUTION" → 死刑を ("the death penalty").
    - Final EXECUTION (205.8 s) → 抹殺します.
  - **Chinese (zh-Hant and zh-Hans):** 執行 (#1–#8) → **死刑 (#9 onward)**; 賜予死刑 ("grant the death penalty"); final 死刑. "I will run the EXECUTION" (172.7 s) stays 執行指令 ("execute the command").
  - A Japanese YouTube commenter also points out the 実行 → 抹殺 switch.
- **For the fan MV:** the switch at **155.2 s (9th EXECUTION)** is the official tipping point from "running code" to "killing".

### 2.4 "EIN DOS TROIS NE FEM LIU": which languages

| Sung | Number | Language | Code line (world.announce) |
|---|---|---|---|
| EIN | 1 | German *ein(s)* | `"1", "de"` |
| DOS | 2 | Spanish *dos* | `"2", "es"` |
| TROIS | 3 | French *trois* | `"3", "fr"` |
| NE | 4 | Korean native numeral 넷 *net*, which becomes 네 *ne* before a counter | `"4", "kr"` |
| FEM | 5 | Swedish *fem* (same word in Danish/Norwegian) | `"5", "se"` |
| LIU | 6 | Mandarin Chinese 六 *liù* | `"6", "cn"` |

- The language codes come straight from the official code: `world.announce("1", "de"); … world.announce("6", "cn");`.
- In the MV these six lines appear at 154.0–156.6 s, before they are sung at 158.9 s [FI][PX].
- Official CC renders them as いち…ろく (JP) and 一…六 (zh). The CC spells TROIS and NE (some wikis misspell "TRIOS").
- Fan readings:
  - a countdown before the execution;
  - six victims or "six other AIs" (CSDN);
  - a global, multilingual broadcast by the world (Qiita treats it as a pronunciation gag with little story weight).

### 2.5 The ending

- **Code facts.** After the LOVE lines (`learnTopic`, `takeExamTopic`, `getAlgebraicExpression`, `escape("love")`), the program's last statement is `world.execute(me);`, followed by `}` for `main` and `}` for the class.
- **In the MV:** the code layer is empty for ≈12 s (194–205.8). Then this single line rises from the bottom on the last "EXECUTION", and the picture fades to black. A top comment (≈13k likes) praises that "they included the class ending bracket" [CM].
- **Readings:**
  1. The world deletes or kills me: punishment, or self-requested ("world, execute me").
  2. Suicide or uninstall after realising love (CSDN).
  3. Me is finally "run": it completes, having learned love (positive reading).
  4. *(Speculative, ours.)* Execution restarts the program. The song opens with "Switch on the power line", which suggests a loop.

### 2.6 Smaller lore details

- **`new Lovable("Me", 0, true, -1, false)` vs `new Lovable("You", 0, false, -1, false)`.** The objects differ only in the third argument (`true` for me, `false` for you). It is undefined; fans read it as an "is AI / is inorganic / is god / can't leave" flag. `new World(5)` is also unexplained.
- **617 and 3691.**
  - `timeTravelForTwo("AD", 617, …)` and `("BC", 3691, …)`.
  - 617 recurs across Mili's work: it unlocks the secret track *Shitty Flowers*, Cassie and Yamato married on 6/17, and it is a hotel room number in other songs.
  - *world.search(you);*'s code reuses "0617-06-17T0617" and "3691-03-06T0901".
- **CAPTCHA in the artwork.** The distorted text window right of centre is widely read as a **CAPTCHA spelling "LOVE"**. A ≈9.9k-like JP comment notes that CAPTCHAs are designed so computers *can't* read them, i.e. "a computer cannot recognise LOVE".
- **The code is pseudo-code** (traP / Qiita / NEVEU notes). It does not compile: none of the classes exist, and some `if` conditions return non-booleans (e.g. `getSenseIndex(...)`). It is meant to be read alongside the lyrics.
- **Spelling drift.** A well-known fan gist (hibiyasleep, 2016-08-19) interleaves lyrics as comments but writes `getNumSimulationsAvailable`. The MV shows **`getNumStimulationsAvailable`** and includes `me.reset…()` calls.

---

## 3. The Java source in the lyrics: structure

No full code is reproduced here; only identifiers and a few short fragments.

**File and class**
- `package goddrinksjava;`
- A Javadoc block: "The program GodDrinksJava implements an application that creates an empty simulated world with no meaning or purpose", `@author momocashew`.
- `public class GodDrinksJava` with a single `public static void main(String[] args)`.

**Types used (never defined, so the code is pseudo-code)**
- `Thing` (base type).
- `Lovable` (constructor `(String name, int, boolean, int, boolean)`).
- `World` (constructor `World(5)`).
- Shape/number "types" checked with `instanceof`: `PointSet`, `Circle`, `SineWave`, `Sequence`.
- Object "types": `Eggplant`, `Tomato`, `TabbyCat`.
- The standard Java `IllegalArgumentException`.

**Program flow**, mapped to the lyric sections (method names only):

| Section | Calls |
|---|---|
| Setup | `Thing me = new Lovable("Me", …)`, `Thing you = new Lovable("You", …)`, `World world = new World(5)`, `world.addThing(me/you)`, `world.startSimulation()` |
| Geometry verse | Four `if (me instanceof …)` blocks: PointSet → `you.addAttribute(me.getDimensions().toAttribute())` + `me.resetDimensions()`; Circle → circumference + reset; SineWave → `you.addAction("sit", me.getTangent(you.getXPosition()))`; Sequence → `me.setLimit(you.toLimit())` |
| Pre-chorus 1 | `me.toggleCurrent()`, `me.canSee(false)`, `me.addFeeling("dizzy")`, `world.timeTravelForTwo("AD", 617, me, you)`, `…("BC", 3691, …)`, `world.unite(me, you)` |
| Chorus 1 | `if (me.getNumStimulationsAvailable() >= you.getNumStimulationsNeeded())` → `you.setSatisfaction(me.toSatisfaction())`; `if (you.getFeelingIndex("happy") != -1)` → `me.requestExecution(world)`; `world.lockThing(me)`, `world.lockThing(you)` |
| Objects verse | Eggplant → nutrients transfer + reset; Tomato → antioxidants + reset; TabbyCat → `me.purr()`; `if (world.getGod().equals(me))` → `me.setProof(you.toProof())` |
| Pre-chorus 2 | `me.toggleGender()`, `world.procreate(me, you)`, `me.toggleRoleBDSM()`, `world.makeHigh(me)`, `world.makeHigh(you)` |
| Chorus 2 | `if (me.getSenseIndex("vibration"))` → `me.addFeeling("complete")`; `world.unlock(you)`, `world.removeThing(you)`; `me.lookFor(you, world)` ×5 |
| Bridge | `if (me.getMemory().isErasable())` → `me.removeFeeling("disheartened")`; `try { me.setOpinion(me.getOpinionIndex("you are here"), false); } catch (IllegalArgumentException e) { world.announce("God is always true."); }` |
| Breakdown | `world.runExecution()` ×12; `world.announce("1","de")` … `("6","cn")`; `world.runExecution()` |
| Final chorus | `if (world.isExecutableBy(me))` → `you.setExecution(me.toExecution())`; `if (world.getThingIndex(you) != -1)` → `world.runExecution()`; `me.escape(world)` |
| Love | `me.learnTopic("love")`, `me.takeExamTopic("love")`, `me.getAlgebraicExpression("love")`, `me.escape("love")` |
| End | `world.execute(me);` then `}` `}` |

**Design notes**
- The "If I'm X, then I give you Y" pattern is literally `instanceof` + transfer + reset. Me loses what it gives.
- "You have left" ×5 maps 1:1 to five `lookFor` calls.
- The only exception in the program is the "Challenging your god → ILLEGAL ARGUMENTS" moment.
- In the code, "you" is **removed by the world**, not leaving by its own method.

---

## 4. Lyric → visual table for the OFFICIAL MV

### 4.1 What is on screen the whole time

The constant layer for every row is one static 1920×1080 pixel/illustration collage by Kazuki Takakura (§5). It has no motion, no zoom, no pans, no cuts and no flashes; this was verified by the pixel scan over all 2,120 sampled frames [PX].

Only the **code overlay** changes:
- white monospaced serif text (Courier-like) with a thin dark outline;
- original Java indentation, left-aligned at roughly x = 120–200 px;
- occupies the left ~55–60 % of the frame and passes over the YES/NO window, the hourglass, the left guardian figure and the terminal window;
- no syntax colouring and no visible typing cursor; lines pop in whole at the bottom edge;
- the whole text block scrolls upward continuously at ≈70 px/s (1080p) and exits at the top.

### 4.2 How to read the table

- "Our t" = the user's timestamp, which equals the official CC start.
- "Code entering" = lines that newly appear at the bottom around that moment. Identifiers are paraphrased.
- "Code layer" = where the visible block sits (y-range in 1080p px from [PX]) and anything notable.
- Rest of frame = static artwork unless noted.
- Confidence: **H** = frame inspected at or within ~0.5 s of that time; **M** = from the pixel scan or interpolated between inspected frames; **L** = not verified.

### 4.3 Intro: boot sequence

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 0.1 | Switch on the power line | none | **No code at all.** The full artwork is visible clean: winged girl on throne in the blue-violet ring, flaming guardians left and right. | H | FI, PX |
| 1.7 | Remember to put on | `package goddrinksjava;` | One line at the very bottom-left (y≈1004). | H | FI, PX |
| 2.9 | PROTECTION | Javadoc opener + "The program GodDrinksJava implements … / creates an empty simulated world with no meaning or purpose." | 3 lines, y≈932–1060. | H | FI |
| 3.9 | Lay down your pieces | `* @author momocashew` | y≈872–1060. | H | FI |
| 5.5 | And let's begin | Javadoc close, `public class GodDrinksJava {`, `public static void main(String[] args) {` | 9 lines, y≈764–1076. | H | FI |
| 6.4 | OBJECT CREATION | `Thing me = new Lovable("Me", …);` | y≈708–1076. | H | FI |
| 7.4 | Fill in my data parameters | `Thing you = new Lovable("You", …);` | y≈648–1076. | H | FI |
| 10.1 | INITIALIZATION | `World world = new World(5);`, `world.addThing(me);` | Block y≈484–1068. | H | FI |
| 11.1 | Set up our new world | `world.addThing(you);` | y≈424–1060. | H | FI |
| 12.9 | And let's begin the | `world.startSimulation();` | y≈312–1012. | H | FI |
| 13.9 | SIMULATION | none | Header block (≈13 lines) drifting up, y≈248–948. | H | FI, PX |
| 16.0 | world.execute(me); | **none.** The title line is *not* displayed here. | Block in upper-left, y≈120–816, still rising. | H | FI |

### 4.4 Instrumental 16.0–29.7

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 19–28 | (instrumental) | none | Header block scrolls off the top: 19 s y≈16–632; 22 s y≈48–444; 25 s y≈68–260; 28 s at top edge. **≈28.5–29.6 s: clean artwork.** | H | FI, PX |

### 4.5 Verse 1a: geometry

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 29.7 | If I'm a set of points | `if (me instanceof PointSet) {` | Single line at the bottom. | H | FI, PX |
| 31.1 | Then I will give you my | `you.addAttribute(me.getDimensions()…)`, `me.resetDimensions();`, `}` | y≈952–1020. | H | FI |
| 32.7 | DIMENSION | `if (me instanceof Circle) {` (entered ≈31.6, ahead) + circumference transfer (≈32.1) | y≈820–1040. | H | FI(31.6), PX |
| 33.4 | If I'm a circle | `me.resetCircumference();`, `}`; `if (me instanceof SineWave) {` already entering (≈33.2, ahead) | y≈756–1068. | H | FI |
| 34.6 | Then I will give you my | `you.addAction("sit", me.getTangent(…))` (≈34.7) | y≈652–1076. | M | PX, FI(35.2) |
| 36.3 | CIRCUMFERENCE | `if (me instanceof Sequence) { me.setLimit(you.toLimit()); }` (entered ≈35.0, **≈5.7 s ahead of "infinity"**) | y≈520–976. SineWave + Sequence blocks at the bottom. | H | FI(35.2), PX |
| 37.1 | If I'm a sine wave | none (SineWave and Sequence blocks are already on screen) | y≈452–912. | H | FI |
| 38.6 | Then you can sit on all my | none | y≈324–784. | M | PX |
| 40.0 | TANGENTS | none | y≈204–660. | M | PX |
| 40.7 | If I approach infinity | none | Whole geometry block in the middle/upper left (y≈148–608). **Bottom third empty.** | H | FI |
| 42.3 | Then you can be my | none | y≈4–468. | M | PX |
| 43.5 | LIMITATIONS | `me.toggleCurrent();` starting to enter (≈43.6) | Geometry block at top edge. | H | FI |

### 4.6 Verse 1b: pre-chorus

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 44.5 | Switch my current | `me.toggleCurrent();` | Bottom line; old block at the very top. | H | FI |
| 45.9 | To AC to DC | `me.canSee(false);` (≈45.4–46.4) | Two blocks: top remnants + new lines at bottom. | M | PX, FI(47.5) |
| 47.7 | And then blind my vision | `me.addFeeling("dizzy");`, `world.timeTravelForTwo("AD", 617, …)`, `…("BC", 3691, …)` (≈46.4–47.5, **≈4–6 s ahead** of "travel / A.D. to B.C.") | Bottom strip shows toggleCurrent → BC time-travel. | H | FI(47.5) |
| 49.5 | So dizzy so dizzy | `world.unite(me, you);` (≈48.3) | y≈576–976. | M | PX |
| 51.4 | Oh we can travel | none | Time-travel + unite lines in the middle, y≈424–824. | H | FI |
| 53.2 | To A.D to B.C | none | y≈264–664. | M | PX |
| 55.1 | And we can unite | none | y≈112–508; lower half clean. | H | FI(55.0) |
| 56.9 | So deeply so deeply | none | y≈48–356; bottom empty. | M | PX |

### 4.7 Chorus 1

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 59.2 | If I can | `if (me.getNumStimulationsAvailable() >=` / `you.getNumStimulationsNeeded()) {` | 2 lines at bottom. | H | FI, PX |
| 59.7 | If I can give you all the | `you.setSatisfaction(me.toSatisfaction());` (≈60.3) | — | M | PX |
| 62.0 | STIMULATIONS | `if (you.getFeelingIndex("happy") != -1) {`, `me.requestExecution(world);`, `}`, `world.lockThing(me);` (≈61.8, **4–11 s ahead**) | y≈792–1072. | H | FI(61.9) |
| 62.6 | Then I can | `world.lockThing(you);`. The chorus code is now complete. | y≈736–1076. | H | FI |
| 63.5 | Then I can be your only | none | y≈656–1000. | H | FI(63.7) |
| 65.4 | SATISFACTION | none | y≈504–844. | M | PX |
| 66.6 | If I can make you happy | none | happy/requestExecution lines mid-screen (y≈400–740). | H | FI |
| 68.3 | I will run the | none | y≈260–604. | M | PX |
| 69.3 | EXECUTION | none (the `requestExecution` line is in the upper-middle) | y≈176–520. | M | PX |
| 70.1 | Though we are trapped | none | lockThing lines upper-middle (y≈112–448); **bottom half clean.** | H | FI |
| 71.8 | In this strange strange | none | y≈0–308. | H | FI(72.0) |
| 73.2 | SIMULATION | none | Block leaving the top (y≈0–192); **screen almost clean.** | M | PX, FI(73.9) |

### 4.8 Verse 2a: objects and god

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 74.0 | If I'm an eggplant | `if (me instanceof Eggplant) {` (≈73.9–74.5) | Bottom. | H | FI(75.1), PX |
| 75.4 | Then I will give you my | nutrients transfer line | — | H | FI(75.1) |
| 77.0 | NUTRIENTS | `me.resetNutrients();`, `}` | y≈904–1076. | H | FI(76.8) |
| 77.6 | If I'm a tomato | `if (me instanceof Tomato) {` | y≈868–1076. | H | FI(77.4) |
| 79.2 | Then I will give you | antioxidants transfer + reset | y≈776–1020. | H | FI(79.8) |
| 80.6 | ANTIOXIDANTS | `if (me instanceof TabbyCat) {` (≈80.4, ahead) | — | H | FI(79.8/81.4) |
| 81.4 | If I'm a tabby cat | `me.purr();`, `}` | y≈652–1028. | H | FI |
| 82.8 | Then I will purr for your | `if (world.getGod().equals(me)) {` (≈82.7, **ahead**) | y≈572–1076. | H | FI(82.7) |
| 84.3 | ENJOYMENT | `me.setProof(you.toProof());`, `}` | y≈488–996. | H | FI(85.1) |
| 85.1 | If I'm the only god | none | God block at bottom. | H | FI |
| 86.5 | Then you're the proof of my | none | y≈360–868. | H | FI(86.6) |
| 87.9 | EXISTENCE | none | y≈280–788. | M | PX |

### 4.9 Verse 2b: pre-chorus

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 88.6 | Switch my gender | `me.toggleGender();` | Bottom. | H | FI |
| 90.2 | To F to M | `world.procreate(me, you);` | — | H | FI(90.3) |
| 92.0 | And then do whatever | `me.toggleRoleBDSM();` (**≈3.5 s ahead** of "switch my role") | — | H | FI(92.1) |
| 94.0 | From AM to PM | `world.makeHigh(me);` | — | H | FI(93.9) |
| 95.5 | Oh switch my role | `world.makeHigh(you);` | Pre-chorus block complete at the bottom. | H | FI |
| 97.7 | To S to M | none | Block rising (y≈52–928). | H | FI |
| 99.3 | So we can enter | none | y≈0–836. | M | PX |
| 101.5 | The trance the trance | none | Block upper (y≈8–716); bottom clean. | H | FI |

### 4.10 Chorus 2

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 103.5 | If I can | none (bottom empty) | y≈228–604. | H | FI(103.6) |
| 104.2 | If I can feel your | `if (me.getSenseIndex("vibration")) {`, `me.addFeeling("complete");` | Bottom. | H | FI(104.4) |
| 106.3 | VIBRATIONS | `}`, `world.unlock(you);` (**the "leaving" code starts here, 4.6 s early**) | — | H | FI |
| 107.2 | Then I can | `world.removeThing(you);` | — | H | FI(107.3) |
| 107.9 | Then I can finally be | 1st `me.lookFor(you, world);` (≈108.3) | — | H | FI(108.4) |
| 110.2 | COMPLETION | 2nd `lookFor` (≈109.5) | — | H | FI(109.6) |
| 110.9 | Though you have left | 3rd `lookFor` (≈110.7) | unlock / removeThing / lookFor ×3 visible. | H | FI |
| 112.2 | You have left | 4th `lookFor` (≈111.9) | — | H | FI(112.2) |
| 113.1 | You have left | 5th `lookFor` (≈113.0) | **Column of five identical lookFor lines** in the lower-left. | H | FI(114.0) |
| 114.2 | You have left | none | Column rising (y≈476–1020). | H | FI(114.0) |
| 114.9 | You have left | none | — | M | PX |
| 115.8 | You have left me in | `if (me.getMemory().isErasable()) {`, `me.removeFeeling("disheartened");` (≈115.4, **ahead**) | — | H | FI |
| 117.3 | ISOLATION | `}` | lookFor column mid-screen. | H | FI |

### 4.11 Bridge

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 118.3 | If I can | `try {`, `me.setOpinion(me.getOpinionIndex("you are here"), false);` | — | H | FI(118.4) |
| 119.0 | If I can erase all the pointless | `} catch (IllegalArgumentException e) {` (≈119.3) | — | H | FI(119.4) |
| 120.9 | FRAGMENTS | `world.announce("God is always true.");`, `}` (complete by 120.0, **≈11 s before "ILLEGAL ARGUMENTS" is sung**) | Lower-left. | H | FI(120.0) |
| 121.7 | Then maybe | none | Fragments → catch block lower/middle (y≈48–988). | M | PX |
| 122.7 | Then maybe you won't leave me so | none | — | M | PX |
| 124.9 | DISHEARTENED | none | y≈8–808. | M | PX |
| 125.7 | Challenging your god | none | try/catch block mid-screen, over the YES/NO window. | H | FI |
| 128.7 | You have made some | none | y≈0–596. | M | PX |
| 131.2 | ILLEGAL ARGUMENTS | none | "God is always true." line in the upper third (y≈44–452). | H | FI |

### 4.12 Instrumental break 133.6–147.6

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 134–137 | (instrumental) | none | Last lines leave the top (136 s: one line at top). | H | FI(136.0) |
| 138–147.6 | (instrumental) | none | **≈10 s of pure static artwork, no code**: the longest clean shot besides the outro. | H | PX |

### 4.13 Breakdown: EXECUTION, EIN DOS TROIS NE FEM LIU

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 147.7 | EXECUTION (#1) | 1st `world.runExecution();` enters ≈147.9 | Screen still clean at 147.66. | H | PX |
| 148.6–153.2 | EXECUTION #2–#8 | A new `world.runExecution();` **every ≈0.5 s** (147.9, 148.4, 148.9, 149.4, 150.0, 150.5, 151.0, 151.5, 152.0, 152.5, 153.0, 153.5: 12 lines), **twice the sung rate** | A growing column of identical lines up the left side (149.5 s ≈4 lines; 153.2 s ≈11). | H | FI(149.5/153.6), PX |
| 154.0 | EXECUTION #8 | `world.announce("1","de");` | 13 lines. | M | PX |
| 155.2 | EXECUTION #9 (JP CC → 抹殺, zh → 死刑) | `("2","es")`, `("3","fr")` (≈154.5–155.0) | — | H | FI(155.1) |
| 156.1 | EXECUTION #10 | `("4","kr")`, `("5","se")` (≈155.5–156.0) | — | M | PX, FI(157.2) |
| 157.0 | EXECUTION #11 | `("6","cn")` (≈156.6), final `world.runExecution();` (≈157.1) | **Code fills the entire left half top to bottom (21 lines).** The densest frame of the MV. | H | FI(157.2), PX |
| 158.0 | EXECUTION #12 | none | y≈0–968. | M | PX |
| 158.9 | EIN | none | The six announce lines drift up through the middle-left (y≈16–864). | H | FI |
| 159.3 | DOS | none | — | M | PX |
| 159.7 | TROIS | none | — | M | PX |
| 160.2 | NE | none | — | M | PX |
| 160.7 | FEM | none | — | M | PX |
| 161.1 | LIU | none | — | M | PX |
| 161.6 | EXECUTION | none | Block in the upper half (y≈0–548); **lower half clean.** | H | FI |

### 4.14 Final chorus

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 162.6 | If I can | `if (world.isExecutableBy(me)) {` (≈162.7) | Bottom. | H | FI(162.8) |
| 163.3 | If I can give them all the | `you.setExecution(me.toExecution());` (≈163.2), `}` (≈164.4) | — | M | PX |
| 165.2 | EXECUTION (zh CC: 賜予死刑 "grant the death penalty") | `if (world.getThingIndex(you) != -1) {` (≈164.9) | — | H | FI(165.2/166.0) |
| 166.0 | Then I can | `world.runExecution();`, `}` | — | H | FI |
| 167.0 | Then I can be your only | `me.escape(world);` (≈167.7) | — | M | PX |
| 168.9 | EXECUTION | none | Final-chorus block lower-middle (y≈632–884). | M | PX |
| 169.8 | If I can have you back | none | y≈564–812; `escape(world)` visible. | H | FI |
| 171.9 | I will run the | none | y≈416–672. | M | PX |
| 172.7 | EXECUTION | none | y≈360–608. | M | PX |
| 173.6 | Though we are trapped | none | Block upper-middle. | H | FI(173.7) |
| 175.0 | We are trapped ah | none | y≈196–440; bottom clean. | M | PX |

### 4.15 "LOVE" section

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 177.2 | I've studied | `me.learnTopic("love");` (≈177.0) | Bottom. | H | FI(177.3) |
| 178.2 | I've studied how to properly | `me.takeExamTopic("love");` (≈177.8), `me.getAlgebraicExpression("love");` (≈178.6) | — | M | PX |
| 179.9 | LO-O-OVE | `me.escape("love");` (≈179.5). All 4 love lines are on screen within 2.5 s. | — | H | FI(179.9) |
| 180.9 | Question me | none | 4-line love block at the bottom (y≈792–972). | M | PX |
| 181.9 | Question me I can answer all | none | y≈720–908. | M | PX |
| 183.6 | LO-O-OVE | none | y≈596–784. | M | PX |
| 184.5 | I know the algebraic expression of | none | y≈528–712. | M | PX |
| 187.7 | LO-O-OVE | none | y≈304–492 (mid-frame). | M | PX |
| 188.5 | Though you are free | none | y≈252–372. | M | PX |
| 189.7 | I am trapped | none | y≈164–284. | M | PX |
| 190.8 | Trapped in | none | y≈76–256. | M | PX |
| 191.4 | LO-O-OVE | none | y≈48–228; exits the top by ≈194. | M | PX |

### 4.16 Outro

| Our t | Lyric | Code entering | Code layer / screen state | Conf. | Src |
|---|---|---|---|---|---|
| 194–205.7 | (outro instrumental) | none | **≈12 s of pure static artwork, no code.** | H | PX |
| 205.8 | EXECUTION (final; JP 抹殺 / zh 死刑) | **`world.execute(me);`** (≈205.9), then `}` and `}` | One line at the bottom (y≈1068) with the two braces beneath. | H | FI(206.6/208.2), PX, CM |
| 207–209 | — | none | The line rises (y≈936 at 207.0; ≈760 at 208.5; ≈652 at 209.5). | H | PX |
| ≈209.3–211.5 | — | — | **Entire frame fades to black** (mean luma 130 → 0, roughly linear). | H | PX |
| 211.5–212.3 | — | — | Black. End. | H | PX |

---

## 5. Visual motifs and colour palette of the official MV

### 5.1 Composition

One frame, read left → centre → right. All details are [FI] at t = 0.3 s unless noted.

**Centre: the "goddess / AI" figure**
- A girl with long, wavy, tentacle-like **teal/mint-green hair** and an ahoge.
- Her eyes are covered by a **black visor showing two glowing red vertical slits**, a robot "face display". This can be read as `canSee(false)` / "blind my vision".
- She wears a white high collar under a layered **crimson/magenta robe**, kimono- or hakama-like, with USB/port-like panels on the sleeves.
- She holds a glowing **power-button symbol (⏻)** at her chest with a green ring. White and orange **cables are knotted around her waist like an obi** and trail down.
- She sits on a tall **periwinkle/blue throne** (shaped like a phone or PC case) flanked by **red lens-like orbs** (speakers or eyes).
- Behind her are large **pixel-art angel wings in lime/yellow-green** and a huge **glowing blue-violet ring** (halo / mandorla / power-button "O" / portal) with a white inner glow.
- **Two pink smartphones** with arrow-cursor icons dangle on cables inside the ring.

**Left guardian**
- A muscular **teal-skinned** demon-like figure crouching, with clawed feet.
- **Purple dome helmet with a single drill-like horn.**
- Surrounded by a huge **orange flame aureole**.
- Holds a colourful robotic contraption; an orange segmented cable/tail trails off-frame.

**Right guardian** (mirror of the left)
- A muscular **blue-grey** figure with an **orange CRT/box "monitor head"** topped by a cone/horn; a yellow sticker/face is on the box.
- **Magenta flame aureole.**
- Holds an orange-and-pink segmented serpent/dragon.

The two flanking guardians with flame halos read like **Buddhist wrathful guardians (Niō / Myōō such as Fudō)** around an enthroned deity. This fits Takakura's Buddhism-inspired digital iconography and the lyric "If I'm the only god". Interpretation, medium confidence.

**OS / desktop UI collage**
- A "YES / NO" dialog: a smiling-emoji face with "!!!" marks and yellow-black hazard stripes.
- A window with a **red hourglass** (waiting/loading).
- A black terminal window listing **"TWIN ISLAND MILKERY" ×5**: green text with the 4th row red. Possibly a nod to *Miracle Milk*; low confidence.
- A **CAPTCHA window with distorted glyphs read by fans as "LOVE"**, a binary-digit input field, and a green refresh icon [FI][CM].
- A **"DL 80%" progress window** with a rainbow bar: a download that never completes.
- **Layer-panel lists with "eye" visibility icons and folder icons** at the far left and right edges, like a Photoshop/CLIP layers palette. The world is a document being edited.
- Stacked grey window title bars with minimise/maximise/close buttons.

**Background**
- **Neon-green/aqua circuit-board traces radiating like a sunburst** on navy.
- Dithered pixel blocks (red/green/yellow), glitch scanline stripes (yellow/red/white) behind the throne.
- Yellow and green **emoji faces** (smiling, frowning, angry).
- An orange slinky/spring coil.
- Salmon/peach diagonal floor stripes.
- A tiny **shmup-style pixel spaceship with flame** at bottom centre.

**Text layer:** white Courier-like monospaced Java (§4.1).

### 5.2 Motifs

| Motif | Reading |
|---|---|
| Power symbol, cables, phones, wings, halo/ring, throne | Machine-as-deity; "Switch on the power line"; devotion and connection to users. |
| UI dialogs: YES/NO, hourglass, progress bar, CAPTCHA "LOVE", layers panel | The world is a computer interface; love is unreadable to machines; completion is never reached. |
| Wrathful guardians with flames | God/judgement; "EXECUTION"; protection ("Remember to put on PROTECTION"). |
| Pixel art + glitch + illustration mix | Simulation vs "real"; data corruption. |
| Code drifting upward | Program execution and the passage of time; the screen repeatedly "empties" between sections (16–29.7 s, 138–147.7 s, 194–205.8 s). This works as a natural chaptering device. |
| Single final line + fade to black | Termination of the program: `world.execute(me);` then `}` `}` then black. |

### 5.3 Colour palette

Values are k-means (k = 14) over a 192×108 downsample of the clean frame at t = 0.3 s. Share = % of pixels. Element associations are by eye.

| Hex | Share | Where it lives |
|---|---|---|
| `#d13e6d` | 11.7 % | Crimson-magenta: robe, right flame aureole, red dialog accents, stripes |
| `#7d8994` | 11.3 % | Cool grey: window chrome and title bars |
| `#202122` | 10.0 % | Near-black: terminal windows, outlines |
| `#483258` | 9.7 % | Deep purple: shadows, helmet, dark fills |
| `#d2c0bb` | 9.5 % | Pale peach/rose: floor stripes, skin highlights |
| `#8b8af1` | 7.8 % | Periwinkle/violet: the ring and the throne |
| `#de9e40` | 7.4 % | Orange-amber: left flame aureole, coil, cables, monitor head |
| `#124970` | 5.9 % | Navy: circuit-board background |
| `#e2f180` | 5.2 % | Pale lime: wings, highlights |
| `#54dd65` | 4.9 % | Neon green: circuits, emoji |
| `#29a67f` | 4.8 % | Teal-green: hair shadows, circuit traces |
| `#3aeec7` | 4.7 % | Aqua/mint: hair, circuit glow |
| `#d6f2f3` | 4.7 % | Pale cyan-white: ring glow, highlights |
| `#1a60e2` | 2.4 % | Electric blue: ring outline, glitch blocks |
| `#ffffff` | — | Code text (white, dark outline) |

**Overall look:** a saturated, high-contrast psychedelic RGB palette. The dominant opposition is **magenta/crimson vs mint/neon green**, held together by violet/blue (the ring) and orange (the flames), on navy/black UI darks. There are no soft gradients except the ring glow; most edges are hard pixel edges.

---

## 6. Related (non-official) visuals to be aware of

| Work | Notes |
|---|---|
| **"[FMV] world.execute(me); - MILI"** by 땡닢 / テンニプ / Eodslv | 2017-03-05; ≈2.19 M views on YouTube; a Bilibili re-upload has ≈2.6 M plays. The most-watched fan animation; often mistaken for "the MV". |
| Fan animation by **そゐち (Sowiti)** | Made as a university graduation project. It led to Sowiti drawing the **Arcaea jacket** for the song [W: pixiv, Arcaea wiki]. |
| **mochimikan (もちみかん)** hand-drawn *Lobotomy Corporation* "Angela" video | Credited by fans with starting the Mili × ProjectMoon collaboration. |
| Josephine Anna Wall (Skuld) | GPU-shader VR piece, *Venice VR Expanded* 2021. |
| Exile- osu! storyboard | Reportedly a famous storyboard built from Java code (CSDN). Not verified; low confidence. |
| Many Bilibili code-MVs and analyses | e.g. "《world.execute(me);》中度解析" by Black瑾; "如果聊天窗口就是她的整个世界" (≈0.9 M plays). |

---

## 7. Sources

**Primary**
- Official MV: https://www.youtube.com/watch?v=ESx_hy1n7HA. Used for the description, player data, official CC tracks (en/ja/zh-Hant/zh-Hans) and top comments.
- Frame and pixel analysis: done by me in-browser on that video at 1080p (2026-10-14).
- Local copy of the official English CC: `source/world.execute(me).vtt`.

**Wikis and databases**
- Mili Fandom: https://mili.fandom.com/wiki/World.execute(me); (code transcription, release date); /wiki/617; /wiki/Miracle_Milk; /wiki/Key_Ingredient
- Mili wiki.gg: https://mili.wiki.gg/wiki/World.execute(me);
- pixiv Encyclopedia: https://dic.pixiv.net/a/world.execute(me)%3B (story summary, fan-MV and ProjectMoon trivia)
- Moegirl: https://zh.moegirl.org.cn/World.execute(me) (via search snippets; the site blocks direct fetch)
- Arcaea wiki (JP): https://wikiwiki.jp/arcaea/world.execute%28me%29%3B ; Rotaeno wiki: https://wikiwiki.jp/rotaeno/world.execute%28me%29 ; https://wikiwiki.jp/rhythmgame/Mili
- Hooktheory: https://www.hooktheory.com/theorytab/view/mili/world-execute-me
- Official album page: https://projectmili.com/miracle-milk-en ; Bandcamp: https://project-mili.bandcamp.com/track/world-execute-me

**Code and analysis**
- Fan gist with lyrics as comments: https://gist.github.com/hibiyasleep/519a7bd3bfc2fd4f7d33f3cbf5cdc3bb
- CSDN essay: https://blog.csdn.net/weixin_45590872/article/details/121418029
- Qiita: https://qiita.com/niya1123/items/6680e3c1ba53db827f52
- Other analysis pages found by search: owls.wikidot (https://owls.wikidot.com/note:5su4yrsytytrdy), Zhihu (zhuanlan.zhihu.com/p/721190185, blocked), note.com NEVEU, trap.jp/post/409

**Kazuki Takakura bio**
- https://eizo100.jp/en/archives/member/kazukitakakura ; https://brutus.jp/en/post-423733

**Fan videos**
- 땡닢 FMV: https://www.youtube.com/watch?v=cn4M-fH08XY
- Bilibili search (API) for "world.execute(me) 解析"
