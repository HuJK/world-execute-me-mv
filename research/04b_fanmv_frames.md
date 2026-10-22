# 04b — Fan-MV frame study (part 2): motion-graphics cube, Stogra RP, NieR:Automata

Source material: contact sheets in `work/refsheets/<videoId>/00_intro … 13_outro.jpg` (frames sampled at every lyric timestamp of OUR audio; offsets in `work/refsheets/offsets.json`). Every tile was viewed. Where a tile was too small to read (code text, small type, faces), I re-extracted that exact moment at 760 px wide from `work/refvids/<id>.mp4` (video time = our time + offset) and checked it. Times below are our-audio seconds; "…" = mid-line sample. Anything I could not identify with confidence is marked *(uncertain)*.

| ID | Title / creator | Offset / corr | One-line read |
|---|---|---|---|
| -A0z1n6gQgo | "[FRENZ2017] world.execute(me); [fanart MotionGraphics]" by Vitya (ryo-a) (+ @lapin / d-pnd per in-video credit) | +5.22 s / 0.92 | Pure motion graphics. A wireframe cube is "me". Each lyric is a real-looking Java code line with console output. Cream paper for the first half, black for the second half. |
| zZJl9uRH0zM | "【ストグラ/空架ぐち逸】world.execute(me);【MV】" by がしか | +0.48 s / 0.93 | Dense, psychedelic anime collage about a Stogra GTA-RP character (glasses, gray coat, medical props). Heavy compositing, glitch and datamosh, lots of hand-lettered kinetic type. |
| xMxXv0_ENKg | "【NieR:Automata】world.execute(me);" (credit card: SaMyuChan! @misa915XX) | +0.34 s / 0.85 | Minimal flat silhouettes of 2B/9S on a white vignette, with kinetic typography doing most of the work. Japanese subtitles sit in a black letterbox bar. Red takes over in the second half. |

---

## 1. -A0z1n6gQgo: "[FRENZ2017] world.execute(me); [fanart MotionGraphics]" (Vitya / ryo-a)

### Overall style
- **Medium:** 2D/3D vector motion graphics with no characters. The protagonist is a **thick black wireframe cube** that later turns white on black. The camera flies around and through it in true 3D, and code text is mapped onto the cube's faces in perspective (it reads mirrored when the camera is behind a face).
- **Three visual "acts":**
  1. **Terminal (intro):** a black CLI installer.
  2. **Cream paper (title → chorus 2):** an off-white `#FAFAF0`-ish ground, black strokes, and syntax-colored code. Blue is used for types and `if`, red for strings, teal for numbers, green for comments. Huge **soft, blurred cube shadows** are cast across the frame like a window shadow.
  3. **Black void (bridge → outro):** the palette inverts to a white cube on black with scratchy hatch-line particles. Then come pure flat shapes: **cream circles = me/you** and **crimson hearts**.
- **One live-action insert:** in chorus 2a ("You have left"), desaturated teal photos of a rainy city (umbrella, crosswalk, night skywalk, blue-lit stairs, curved empty corridor) carry a tiny white wireframe cube that wanders alone through them.
- **Typography:** a monospace font (Consolas/Source-Code-like) everywhere. There are three type "voices":
  - **Code lines** typed char-by-char, slightly rotated or perspective-skewed.
  - **Giant diagonal black monospace keywords** that crash in across the frame, with the **cube acting as the letter O** in every "-TION" word.
  - **Small "label bars":** a black band spanning the full screen width, with white letter-spaced caps such as `EXISTENCE` or `enter the TRANCE`, or a tiny black tag like `DEEPLY` / `SIMULATION`.
- **Writing system:** the lyric is rarely shown as plain lyric. It is translated into plausible Java: `me.toggleCurrent()`, `world.timeTravelForTwo("AD", 617, me, you)`, `world.procreate(me, you)`, `me.getMemory().isErasable()`, `world.announce("God is always true.")`. The stack trace reads `at GodDrinksJava.main(GodDrinksJava.java:85)`, a nod to the song's origin as a Java program.
- **Recurring motifs:** the cube (the world/the cage/me), code tails hanging from the cube like a kite string, progress bars `|####|`, the lyric-in-a-highlight-bar, and two circles (me & you).

### Line-by-line
| t | Lyric | On screen |
|---|---|---|
| 0.35–1.12 | Switch on the power line | Black screen, white monospace ASCII box `+---+ / THE WORLD SIMULATION / +---+` at top-left, CLI style. |
| 1.99 | Remember to put on | A new line types out: `<< Remember t…`. |
| 3.17 | **PROTECTION** | The line completes as `<< Remember to put on PROTECTION >>` followed by an installer prompt `Is this ok [y/d/N] :` (the keyword is the confirmation question). |
| 4.12–4.88 | Lay down your pieces | `y` typed, a dashed separator, then `Lay down your pieces : * * * *`. The asterisks are the "pieces", added one per beat. |
| 5.74 | And let's begin | `OBJECT CREATION :` with a `|#####…` progress bar filling. |
| 6.63 | **OBJECT CREATION** | `OBJECT CREATION : COMPLETE` with the progress bar reaching full width. |
| 7.70–8.97 | Fill in my data parameters | `CONFIGURATION OF THE WORLD / Member : me, you / Simulation Type : l…`, form fields being filled like a config wizard. |
| 10.34 | **INITIALIZATION** | `Simulation Type : love` completes. |
| 11.35–12.20 | Set up our new world | `Setting up the world` with a second `|####` progress bar filling. |
| 13.16 | And let's begin the | A **cream circle irises open** from the center over the terminal, with `LET'S BE…` typed inside it. |
| 14.14 | **SIMULATION** | The circle expands to an almost full-screen cream rounded panel: `LET'S BEGIN THE SIMULATION` in centered monospace caps (screen-transition-as-boot). |
| 16.25–19.74 | world.execute(me); | Empty cream canvas with faint specks. Then black line fragments fly in like debris. A gray diagonally hatched sidebar slides in on the left with a dark code panel. |
| 24.08–27.68 | (instrumental) | The line fragments converge into a **sketchy, hatched cube tunnel**, then resolve into a clean thick-stroke black wireframe cube that slowly rotates. The credit sits in an editor panel at lower left: `world.execute(me); /* author: @momocashew (Mili) * MV: @ryo-a, @lapin (d-pnd) */` (comment green, `me` blue). |
| 29.96–30.61 | If I'm a set of points | Camera inside the cube, close to its edges. Black dots pop in one by one inside the cube. Code `…instanceof PointSet) {` sits on a face in perspective. |
| 31.37–32.10 | Then I will give you my | More dots (about 7), with the camera orbiting. `if (me instanceof PointSet) {` is visible on a face. |
| 32.93 | **DIMENSION** | Pull back to a full cube in 3/4 view, so the dots now read as a 3D point cloud. The body `you.addAttribute(me.getDimensions().toAttribute()); me.resetDimensions();` is written on the faces (the keyword becomes `getDimensions()`). |
| 33.66–34.23 | If I'm a circle | `if (me instanceof Circle) {` on a face, plus a **black ellipse** (a circle seen in perspective) floating inside the cube. |
| 34.90–35.67 | Then I will give you my | The cube is viewed head-on, so the circle collapses to a line (seen edge-on). |
| 36.54 | **CIRCUMFERENCE** | Circle plus `…getCircumference()…` code on the face (small, perspective). |
| 37.32–38.03 | If I'm a sine wave | A large black **sine wave** stroke spans the frame inside the cube. `if (me instanceof SineWave) {`, with the earlier PointSet code seen mirrored from behind. |
| 38.85–39.52 | Then you can sit on all my | The sine wave sweeps through the cube with the camera moving; code layers overlap in depth. |
| 40.27 | **TANGENTS** | Wide shot of the cube. Small horizontal **tangent segments sit on the curve's crests**, reading almost like tiny stools. *(The "stool" reading is my interpretation.)* |
| 40.96–41.73 | If I approach infinity | `if (me instanceof Sequence) { me.setLimit(you.toLimit()); }`. **Hyperbola/asymptote curves** bend toward a cube edge without touching it. |
| 42.60 | Then you can be my | Curves crowd the vertical edge, and code from all previous cases piles up mirrored. |
| 43.76 | **LIMITATIONS** | **Hard cut to near-black.** The limit is literally where the picture ends. |
| 44.70–45.35 | Switch my current | Cream ground with a giant blurred black cube shadow wedge. `System.out.println(me.Current().toString());` types out, then console `> AC`. |
| 46.10–46.96 | To AC to DC | `me.toggleCurrent();` is typed, then println again, then `> DC`. The lyric is a state toggle with console output. |
| 47.92–48.80 | And then blind my vision | `me.canSee(false);` (`false` in blue). **The whole frame dims to mid-gray**, as if the lights were cut. |
| 49.78–50.65 | So dizzy so dizzy | Darker gray. `me.addFeeling("dizzy");` (red string) with a **ghosted double image** (the text drawn twice, offset: a dizzy double vision). |
| 51.61–52.49 | Oh we can travel | Back to cream. `System.out.println(Boolean.toString(world.timeTravelable()));` then `> true`. |
| 53.48–54.35 | To A.D to B.C | `world.timeTravelForTwo("AD", 617, me, you);`, with the strings red and numbers teal. |
| 55.33–56.20 | And we can unite | The second call `("BC", 3691, me, you)`, then `world.unite(` begins typing. |
| 57.17–58.27 | So deeply so deeply | Camera at a cube corner (edge-on diamond, thick black edges). A tiny black tag `DEEPLY` with white caps sits in the center. |
| 59.38–61.02 | If I can / If I can give you all the | Wide cream canvas. A **small tilted cube** sits center-right, and a thin code string grows diagonally out of it like a tail: `if (me.getNumStimulationsAvailable() >= you.getNumStimulationsNeeded())`. |
| 62.17 | **STIMULATIONS** | A **giant black monospace word slams in diagonally** (≈45°): `STIMULA / TI[cube]N`, with the cube sitting exactly in the O slot of "-TION". The code tail dangles below. |
| 62.84–64.67 | Then I can / …be your only | The word clears. Cube alone, then the same condition tail regrows. |
| 65.65–66.20 | **SATISFACTION** | Same move: `SATISFAC / TI[cube]N` diagonal, so the cube is the O again. |
| 66.85–68.50 | If I can make you happy / I will run the | New tail: `…FeelingIndex("happy") != -1)` (red string), with the cube rotating. |
| 69.51 | **EXECUTION** | `EXECU / TI[cube]N` huge diagonal, cropped by the frame. |
| 70.33–71.12 | Though we are trapped | The cube thickens into a **beveled picture frame/box**. `world.lockThing(me);` is written inside it. |
| 72.01–72.67 | In this strange strange | Inside the box: `world.lockThing(me); world.lockThing(you);`. The box keeps rotating. |
| 73.42 | **SIMULATION** | The box is rotated to a diamond, with a **black tag `SIMULATION`** across its center. |
| 74.30–74.93 | If I'm an eggplant | Cream. Left: `if (me instanceof Eggplant) {` `}`. Right: the cube, **heavily depth-of-field blurred**, as a background prop. |
| 75.67–76.39 | Then I will give you my | A flat, hand-cut-looking **blue eggplant** pops in next to the code. |
| 77.16 | **NUTRIENTS** | The block expands to `you.addAttribute(me.getNutrients().toAttribute()); me.resetNutrients();`. The keyword is shown as the method name. |
| 77.83–78.60 | If I'm a tomato | `if (me instanceof Tomato) {` |
| 79.48–80.12 | Then I will give you | A flat **crimson tomato** pops in. |
| 80.86 | **ANTIOXIDANTS** | The body expands to `you.addAttribute(me.getAntioxidants().toAttribute()); me.resetAntioxidants();`. |
| 81.60–82.29 | If I'm a tabby cat | `if (me instanceof TabbyCat) {` |
| 83.08–83.75 | Then I will purr for your | A black-and-white **striped tabby cat** sits next to the code, flat graphic. |
| 84.52 | **ENJOYMENT** | The body becomes `me.purr();`. Instead of naming the keyword, it shows the action. |
| 85.33–87.43 | If I'm the only god / Then you're the proof of my | `if (world.getGod().equals(me)) { me.setProof(you.toProof()); }`, slightly rotated, with the blurred cube behind. |
| 88.14 | **EXISTENCE** | A **thin black band across the full width** with letter-spaced white caps `E X I S T E N C E`. |
| 88.84–89.59 | Switch my gender | Cream with blurred cube-edge shadows. `System.out.println(me.gender().toString());` |
| 90.45–91.31 | To F to M | `> female`, then `me.toggleGender();`. |
| 92.27–93.18 | And then do whatever | `> male`, then `world.procreate(me, you);`. |
| 94.20–94.91 | From AM to PM | `AM|#` grows into `AM|################` as a progress bar from AM to PM. |
| 95.72 | Oh switch my role | The bar completes: `AM|########…###|PM`. |
| 96.80–98.74 | …switch my role / To S to M | `System.out.println(me.roleBDSM().toString());` gives `> S`, then `me.toggleRoleBDSM();`. |
| 99.60–100.61 | So we can enter | `> M`, then `world.makeHigh(me);`. |
| 101.72–102.68 | The trance the trance | `world.makeHigh(you);`. A full-width black band reads `e n t e r   t h e   T R A N C E` (lowercase spaced plus caps keyword). |
| 103.73 | If I can | A small cube alone on cream. A tiny `/` stroke begins. |
| 104.45–105.45 | If I can feel your | The tail this time is a **green code comment**, `/* if I can feel your */`, growing out of the cube. |
| 106.54 | **VIBRATIONS** | Giant diagonal `VIBRA…` crashing past the cube. |
| 107.45–109.26 | Then I can / Then I can finally be | Comment tail `/* then I can finally be */`. |
| 110.45 | **COMPLETION** | `COMPLE / TI[cube]N`, with the cube as O. |
| 111.15–111.71 | Though you have left | **Cut to live-action**: rain on a clear umbrella dome, a street with posters, desaturated teal. A tiny white wireframe cube floats in the upper area. |
| 112.47–115.17 | You have left (×4) | One photo per repetition, each with the small white cube: legs crossing a zebra crossing in the rain, a night skywalk with city lights, blue-lit escalator stairs, a rainy rooftop deck with planters. **The cube is alone in the human world.** |
| 116.03–116.71 | You have left me in | An empty, curving underground corridor in pale teal. The cube is small, center floor. |
| 117.52 | **ISOLATION** | Thin, light, semi-transparent outlined letters `ISOLATI` plus the cube as the O, floating in the empty corridor. |
| 118.55–120.12 | If I can / …erase all the pointless | A **full code editor page** (italic monospace, line numbers 65–85) tilted in perspective, with blurred shadows. It shows lines 69–73 `if (me.getSenseIndex("vibration")) { me.addFeeling("complete"); } world.unlock(you); world.removeThing(you);` and then **`me.lookFor(you, world);` ×5**. |
| 121.11 | **FRAGMENTS** | Scroll to `if (me.getMemory().isErasable()) { me.removeFeeling("disheartened"); }`. |
| 121.98–124.00 | Then maybe you won't leave me so | Same page. A **translucent gray highlight bar** appears across the screen at one line (like a selected line). |
| 125.14 | **DISHEARTENED** | The lyric starts typing into the bar: `Chal…`. The keyword itself is carried by the code string `"disheartened"`. |
| 125.96–127.38 | Challenging your god | Bar text `Challenging your God`. Below it: `try { me.setOpinion(me.getOpinionIndex("you are here"), false); }`. |
| 128.91–130.14 | You have made some | Bar text `you have made some` (with "you" in red), plus `catch (IllegalArgumentException e) { world.announce("God is always true."); }`. |
| 131.47–132.62 | **ILLEGAL ARGUMENTS** | Red text starts typing into the bar: `…IllegalArgumentException` and `GodDrinks…`. **The keyword arrives as a runtime exception.** |
| 134.61–138.21 | (instrumental, bridge) | The highlight bar now holds the stack trace `at GodDrinksJava.main(GodDrinksJava.java:85)` over a sketchy, re-hatched cube on gray, rotating fast. |
| 140.01–145.41 | (instrumental) | **Palette inversion**: black ground, white cube, and a storm of white scratch lines (hatching particles) flying around it. |
| 147.91–158.25 | **EXECUTION** (×12) | The camera flies *through* a giant white wireframe cube and over its edges, with dense vertical white streaks like data rain. A faint gray lowercase **serif** `execution` sits dead center. On the last repeats it **tints red**. |
| 159.04–161.28 | EIN DOS TROIS NE FEM LIU | A clean white cube on black. Serif numerals **1, 2, 3, 4, 5, 6** appear one per beat at the cube's corners, each with a tiny **ISO language code**: `de`, `es`, `fr`, `kr`, `se`, `cn`. |
| 161.83 | **EXECUTION** | The cube **dissolves into particles**. |
| 162.86–164.44 | If I can / …give them all the | Black ground, flat shapes only. One **cream circle**, then two circles (me & you) drifting. |
| 165.42 | **EXECUTION** | The two circles hold while **noisy white particle clouds** swarm past diagonally. |
| 166.27–168.17 | Then I can / …be your only | The circles separate. One gains a **Saturn ring** (becomes a planet). |
| 169.16 | **EXECUTION** | The two circles are **connected by a line** like a molecule or dumbbell. |
| 170.07–171.05 | If I can have you back | One circle alone, then the second returns beside it. |
| 172.12 | I will run the | A **row of many circles** (molecule-like clusters with satellites) floods the frame. |
| 172.96 | **EXECUTION** | Back to two circles far apart at the frame edges. |
| 173.89–174.51 | Though we are trapped | The two circles shrink. |
| 175.22–176.31 | We are trapped ah | A white wireframe cube appears around them, with the two tiny dots inside it. |
| 177.50–179.25 | I've studied how to properly | **Vertical white bars** (cage bars or pillars) slide horizontally across the frame. The two circles weave between them. |
| 180.18 | **LO-O-OVE** | **Crimson flat hearts** pop in, some edge-on (flipping like coins). Small gray monospace fragments `LO-` and a separate `O` float apart, so the word is spelled out over time. |
| 181.11–182.97 | Question me I can answer all | Hearts and circles shuffle between the bars, partially overlapping. |
| 183.90 | **LO-O-OVE** | A larger heart cluster with a lone `O` fragment. |
| 184.79–186.30 | I know the algebraic expression of | Hearts multiply in pairs, while circles are partially hidden behind hearts. |
| 187.91 | **LO-O-OVE** | `O-O-O` text over the central heart, with a `V` entering from the bottom. |
| 188.73–189.31 | Though you are free | Only hearts, three clusters. |
| 190.00 | I am trapped | A white bar sweeps through. |
| 190.99–191.61 | Trapped in **LO-O-OVE** | A white wireframe cube in 3/4 view with a **tiny cluster of hearts plus a dot** trapped in its center. |
| 193.16–203.96 | (instrumental, outro) | The cube with hearts inside **slowly shrinks and recedes** to a small object in the black void. |
| 206.06 | **EXECUTION** | The cube becomes a scribble of white lines, and `world.e` types over it. |
| 206.64–209.86 | (end) | Only `world.execute(me);` in white monospace, centered, which then fades to black. |

---

## 2. zZJl9uRH0zM: "【ストグラ/空架ぐち逸】world.execute(me);【MV】" (がしか)

### Overall style
- **Medium:** a 2D anime-illustration MV with heavy compositing. It mixes clean line-art character drawings (gray or flat), photobash/painted backgrounds (aerial city, burning shack, gothic cathedral), 3D renders (product-shot objects, anatomical heart, guns), datamosh/glitch, and psychedelic thermal-map textures. Frame shapes vary: 16:9 letterboxed (most of the MV), a **2.39:1 cinemascope letterbox** in chorus 2, and occasionally lens/eye-shaped masks.
- **Protagonist:** a young man in **round glasses** and a gray high-collar coat (the Stogra RP character 空架ぐち逸 / "Soraka Guchiitsu" per the title card). His hair is blond in the full-color shots and looks green under the green grading. Recurring **medical props** (medkit icons, syringes, pills, CPR, surgical scissors, anatomical heart) suggest he plays a doctor. I'm inferring that from the props, not from any canon. Other RP characters appear as cameos (a gas-mask/helmet figure, a cop, a man in a suit with sunglasses, a bucket-hat figure with a stitched grin).
- **Palette:** shifts per section:
  - Night blue and fire orange (intro).
  - White with black silhouettes and **rainbow thermal-marble fills** (verse 1).
  - Gray monochrome line art (pre-chorus 1).
  - Neon datamosh (chorus 1).
  - Black-and-white plus purple (verse 2).
  - Green psychedelic (pre-chorus 2 and chorus 2).
  - Near-white pencil (bridge).
  - Clean product-shot white (exec).
  - **Red monochrome** (chorus 3).
  - Cyan/magenta light leaks (love).
  - Golden aerial (outro).
- **Typography (three systems):**
  1. **Subtitle line:** the full lyric line in small, thin, letter-spaced italic sans, centered in the bottom letterbox. CAPS keywords stay uppercase inside the line.
  2. **Vertical stacked cascade:** one word or phrase per line, flush left, appearing word by word down the left margin (intro, chorus 1).
  3. **Kinetic display type** at the climaxes: RGB-split glitch letters, text on circular arcs, text wrapped on a rotating cylinder, huge outlined serif, hand-lettered curved script, and distressed blackletter-ish numerals.
- **Recurring motifs:** crosses and gravestones, guns, syringes and pills, phones with glitched screens, a crowd of faceless mannequin silhouettes, blood streaks on the glasses close-up, the aerial city, and lab flasks in fire. **Bookends:** the intro's aerial city and flasks return in the outro, and the half-lidded-eyes SIMULATION shot returns as wide-open eyes on EXECUTION.

### Line-by-line
| t | Lyric | On screen |
|---|---|---|
| 0.35–1.12 | Switch on the power line | Night **aerial top-down of skyscrapers** (dark navy, lit windows, rooftop helipad). Lyric stacks down the left margin one word per line: `Switch / on / the power / line`. |
| 1.99 | Remember to put on | The stack continues: `Remember to / put on`. |
| 3.17 | **PROTECTION** | `PROTECTION` lands as the last line of the stack, in the same small spaced italic but uppercase. There is no special visual. |
| 4.12–4.88 | Lay down your pieces | A **burning corrugated-roof shack** in a dry field at dusk, with orange flames and smoke. The new stack starts `Lay / down / your pieces`. |
| 5.74 | And let's begin | The stack adds `And / let's begin`. |
| 6.63 | **OBJECT CREATION** | Stack ends with `OBJECT CREATION`. Fire continues. |
| 7.70–8.97 | Fill in my data parameters | **Lab glassware (flasks, test tubes, cylinders) engulfed in flames**, with smoke. Stack `Fill / in my / data / parameters`. |
| 10.34 | **INITIALIZATION** | Adds `INITIALIZATION`, with red sparks. |
| 11.35–12.20 | Set up our new world | Close-up of the gray coat torso and hands hanging at the sides in warm brown light. The right hand holds a small white object *(card or phone?)*. Stack `Set / up / our new / world`. |
| 13.16 | And let's begin the | Tilt up the coat toward the collar and face (cropped). |
| 14.14 | **SIMULATION** | **Extreme close-up of eyes behind round glasses, half-lidded, with blood running down the forehead between the lenses.** `SIMULATION` in small italic sits centered between the lenses. |
| 16.25–19.74 | world.execute(me); | A **hyper-saturated rainbow radial warp tunnel** (pink, cyan and yellow blobs streaking outward). A hand reaches forward into the tunnel. |
| 24.08 | (instrumental) | The tunnel burns out to a white core. |
| 25.88–27.68 | (instrumental) | White-out. A title card at upper-left in tiny spaced italic: `world.execute(me); / stogra / Soraka Guchiitsu`. A gray figure's head enters at the bottom. |
| 29.96–32.10 | If I'm a set of points / Then I will give you my | White ground with a **crowd of faceless mannequin silhouettes** facing camera, alternating solid black and white, with only a dot for a mouth. The protagonist is the only drawn person, in gray line art in the middle. **Black status icons pop above heads** one per beat: heart-in-circle, smartphone, medkit, pistol. The subtitle shows the full line. |
| 32.93 | **DIMENSION** | A **rainbow-colored cross** appears above one figure and its body fills with a **psychedelic thermal-marble texture**. A smaller rainbow cross appears over another. |
| 33.66–35.67 | If I'm a circle / Then I will give you my | More icons cycle (heart, burger, medkit, pistol). More bodies turn rainbow with crosses above them. |
| 36.54 | **CIRCUMFERENCE** | A large white figure in the foreground turns its head. Rainbow bodies now dominate the left half. |
| 37.32–39.52 | If I'm a sine wave / Then you can sit on all my | Almost the whole crowd has turned rainbow with crosses. Only the protagonist (gray) and two black figures stay normal. Icons continue (heart, phone, medkit, gun). |
| 40.27 | **TANGENTS** | A syringe icon over a black figure. |
| 40.96–42.60 | If I approach infinity / Then you can be my | Icons: phone, heart, then a **quill/feather** *(uncertain)*. The crowd is fully rainbow except the core figures. |
| 43.76 | **LIMITATIONS** | **Syringe icons** above two black figures. One figure's head is now a black hood. |
| 44.70–45.35 | Switch my current | Gray monochrome line art on a soft gradient. The protagonist's head tilts up from bowed (hair) to face. |
| 46.10–47.92 | To AC to DC | Front close-up: glasses, one eye half-closed, faint smirk, gray tones. |
| 48.80 | …And then blind my vision | Cut to near-white. A **barely visible thin pencil line figure** (a man in a suit, from behind) fades out. |
| 49.78–50.65 | So dizzy so dizzy | Different faint figures (a hooded one, a man in a shirt) appear and dissolve at very low contrast, so you can hardly see them. |
| 51.61 | Oh we can travel | A third faint figure. |
| 52.49 | …Oh we can travel | Close-up of the gray coat sleeve and hand at his side. |
| 53.48–54.35 | To A.D to B.C | A **phone with a glitched rainbow screen** being pulled from the pocket. |
| 55.33–56.20 | And we can unite | The phone shows an **incoming-call screen** (purple gradient, round accept/decline buttons). |
| 57.17–58.27 | So deeply so deeply | Phone held to the ear, eyes closed, face in gray. |
| 59.38 | If I can | A full-frame **rainbow datamosh** (pink/cyan/green smears over a dimly visible figure). |
| 59.94 | If I can give you all the | White light burst with glitch bars. A figure in white is barely visible. |
| 61.02 | …give you all the | The protagonist in white, from behind, before **gothic cathedral doors**, flanked by **rainbow-lit wings or light shafts**. |
| 62.17 | **STIMULATIONS** | Wide cathedral interior: stained glass and the small protagonist in the center aisle. **Rows of bowing black and white silhouettes** line both sides. The keyword appears as **RGB-split glitch letters** (cyan/red) at the top. |
| 62.84 | Then I can | The keyword re-forms as `STIMULATION` **text running along a circular arc around the frame**, mirrored on the right. The bowing figures multiply in echo trails. |
| 63.78–65.65 | Then I can be your only / **SATISFACTION** | Dark red particle space with a central glowing **white orb** and **blue and orange flame-wisps orbiting it** (two souls circling). The lyric stacks down the left: `Then / I can, / then / I can / be your / only / SATISFACTION`. |
| 66.20 | …SATISFACTION | The orb fades to a dim dot in darkness. Stack complete. |
| 66.85 | If I can make you happy | **Eye-shaped (lens) mask**. A gray hand reaches toward camera with dashed construction lines over it, red flecks, and **huge curved hand-lettered `I can`**. |
| 67.63 | …make you happy | A blond character smiling broadly (hair shades the eyes), with a hand raised. Curved hand-lettered `make your` runs vertically along the right edge. |
| 68.50 | I will run the | A gray hand over green PCB/datamosh texture. **Magenta outline `will`** letters. |
| 69.51 | **EXECUTION** | Full datamosh (green circuit board, magenta, white). `EXECUTION` in **outlined letters, partly melted into the glitch**, with line-art figures fragmented around it. |
| 70.33–71.12 | Though we are trapped | **Ground carpeted with white petals.** A sneaker steps in. The subtitle (italic) sits inside the image. |
| 72.01 | In this strange strange | Split: magenta/blue pixel-sorted glitch versus a gray sketch figure. |
| 72.67 | …strange strange | **Warped spiral text** ("strange") swirling over a gray character, with blocky B/W glitch and a scattered rainbow. |
| 73.42 | **SIMULATION** | Clean white: the protagonist **performing CPR chest compressions on a black, glitch-striped silhouette lying on the floor**. Italic `SIMULATION` crosses his torso. (SIMULATION read as CPR training, the doctor's world.) |
| 74.30–74.93 | If I'm an eggplant | Black-and-white **ink-splash** framing. A gray figure hangs **upside down**, with tiny text over it. |
| 75.67 | Then I will give you my | The upside-down gray figure isolated on black. |
| 76.39 | …give you my | A **white grave cross** between two dead trees on black. |
| 77.16 | **NUTRIENTS** | A black **gas-mask/helmet** with goggles, filling the frame (another RP character). |
| 77.83 | If I'm a tomato | A white line-art man in a shirt, smiling, offering an open hand. |
| 78.60 | …a tomato | The same figure **dissolving into white scribble particles**. |
| 79.48–80.86 | Then I will give you / **ANTIOXIDANTS** | Profile two-shot on a white gradient. A **white-outline cop in a tactical vest aims a pistol** at a black-silhouette man in a long coat. |
| 81.60–83.08 | If I'm a tabby cat / Then I will purr for your | Low angle at legs in black trousers. **Dozens of scratchy black hands reach up from below** around them. |
| 83.75–84.52 | …purr for your / **ENJOYMENT** | A black-suited man with **sunglasses** and a small teddy-bear lapel pin, bust shot, gray gradient. |
| 85.33–86.01 | If I'm the only god | The same composition, but the figure wears a **bucket hat and stitched-grin face**, filled with **purple swirling marble**. |
| 86.79–87.43 | Then you're the proof of my | **Two hands reaching toward each other** from opposite sides (a black one from the right, a purple-marble one from the left). |
| 88.14 | **EXISTENCE** | The hands meet. One turns **rainbow thermal**, touching the purple one (a Creation-of-Adam beat). |
| 88.84–89.59 | Switch my gender | A soft, blurred **tree with yellow-green foliage** on white. |
| 90.45–91.31 | To F to M | The same tree **bare and pale blue** (a season or state switch). |
| 92.27–94.91 | And then do whatever / From AM to PM | A **heap of handguns and rifles** silhouetted and blurred against white. A **syringe with red fluid drifts** across the frame. |
| 95.72 | Oh switch my role | The syringe continues downward. |
| 96.80 | …switch my role | A black silhouette with glasses (white-lined) about to **bite a huge black-and-white burger**. |
| 97.99–99.60 | To S to M / So we can enter | The **burger fills the frame**, held by a black hand. |
| 100.61 | …So we can enter | A black hand holding a palmful of **pastel pills**. |
| 101.72 | The trance the trance | **Extreme close-up of an eye**: dilated pupil, bloodshot veins, a hair strand. |
| 102.68 | …the trance | A green-tinted figure gripping their head over a swirling green psychedelic background. |
| 103.73–104.45 | If I can / If I can feel your | Low angle: **sneakers walking a bloodied path between rows of white crosses**, green marbled sky, a white glowing orb. (Switches to 2.39:1 here.) |
| 105.45–106.54 | …feel your / **VIBRATIONS** | Green-tinted close-up: the protagonist with hand over face, holding something *(uncertain, possibly a stethoscope or phone)*. A subtle RGB fringe. |
| 107.45 | Then I can | A **pink blob creature** (soft, gummy-like) lying among white flowers. |
| 108.15 | Then I can finally be | A 3D **anatomical heart and a rabbit** amid a dark heap of guns. |
| 109.26 | …finally be | The protagonist (green-tinted) looking down at a **blood pool**, glasses visible. |
| 110.45 | **COMPLETION** | A hand whose **fingers are filled with the rainbow thermal texture**, green surround. |
| 111.15 | Though you have left | The same, held. |
| 111.71 | …you have left | Stark white with film dust and a vertical scratch: a **dead crow** with small yellow flowers. |
| 112.47 | You have left | A pale hand reaching to touch a gray mechanical helmet *(uncertain)*. |
| 113.35 | You have left | A single **black grave cross** on white, film scratches. |
| 114.40 | You have left | Dark: a pole and a gray sneaker/boot, huge in frame. |
| 115.17 | You have left | A **row of black crosses standing on a heap of guns** against white. |
| 116.03–116.71 | You have left me in | A long-haired hooded figure in gray. A pale hand **injects them with a red syringe**. |
| 117.52 | **ISOLATION** | Near-black green blur. The keyword is only in the subtitle (`me in ISOLATION`). |
| 118.55–119.23 | If I can / If I can erase all the pointless | A **teal-green radial light burst** and liquid tunnel, then a white orb rising. |
| 120.12 | …erase all the pointless | White center vignette with green foliage edges. **Red blood spatter** flies across. |
| 121.11 | **FRAGMENTS** | A green-tinted hand holds a phone with a glitched screen. |
| 121.98–122.96 | Then maybe / you won't leave me so | Close-up of the phone: a **glitched chat/app UI** with message rows, red and yellow pill buttons, and corrupted RGB blocks. |
| 124.00–125.14 | …leave me so / **DISHEARTENED** | Wide 2.39:1: the protagonist **standing alone under a green-lit overpass or platform**, tiny in frame. |
| 125.96–127.38 | Challenging your god | Green and dark: hands, fabric, then a hand raised against a marbled green field. |
| 128.91–130.14 | You have made some | Overexposed white: a **hand reaching upward**, whose fingertips get **red-stained** in the next shot. |
| 131.47 | **ILLEGAL ARGUMENTS** | **Close-up of glasses with glowing RED eyes**, green-yellow tint. |
| 132.62 | …ILLEGAL ARGUMENTS | Purple and white **hyperspace burst**. |
| 134.61–145.41 | (instrumental, bridge) | Near-white, **barely visible colored-pencil roughs** (genga-like) of the protagonist fade in and out: hands with a pen or scalpel, a glasses profile, a figure bending. "Unfinished" art as a breather. |
| 147.91 | **EXECUTION** | A dark phone silhouette on dark gray (start of the object parade). |
| 148.85–158.25 | **EXECUTION** (×11) | **Product-shot turntable parade on light gray**, one 3D object per beat: a "STREET GRAFFITI IDENTIFY CARD" ID card (fields NAME/DOB/SEX/NATIONALITY/CLIME STATUS), bicycle, helicopter, sport motorbike, syringe, AK rifle, handcuffs, lavender sprig, pills, white grave cross, anatomical heart. At right, **small italic `EXECUTION` stacks in a column, one more line per beat** (2, 3, 4… 8+). Later they double with chromatic aberration, a column counter of how many times. (A life inventory.) |
| 159.04 | EIN | **Big distressed serif `EIN`** cut by the frame. A sneaker steps over a **blood pool with a small heart** in it, watercolor texture. |
| 159.43 | DOS | `DOS`, with a pale hand. |
| 159.85 | TROIS | `TROI(S)` with red vein-like scratches, a green-haired figure in a teal hoodie slumped. |
| 160.39 | NE | `NE`, with the **doctor (red eyes) holding surgical scissors and forceps** over a body. |
| 160.84 | FEM | `FEM`, a sneaker kneeling in blood. |
| 161.28 | LIU | `LIU`, the green-haired figure bowed. |
| 161.83 | **EXECUTION** | Wide white: the green-haired figure **kneeling beside a blood pool**, small gray italic `EXECUTION` above. |
| 162.86–163.56 | If I can / If I can give them all the | Red/orange/rainbow datamosh, then near-solid red. |
| 164.44 | …give them all the | Red, with **big white typed letters `If I can / give`** at left, a small bluebird, and black slashes. |
| 165.42 | **EXECUTION** | `EXECUTION` **wrapped around a rotating 3D cylinder/ring** (front reads normally, back mirrored) above a crow head with a glowing red eye, red glass shards. |
| 166.27 | Then I can | A pulsing red dot in black space. |
| 167.27 | Then I can be your only | The red-lit cathedral with crosses and red rays. |
| 168.17 | …be your only | Red line-art figure seated or praying, a ring halo, giant cropped letters `be` and `only`. |
| 169.16 | **EXECUTION** | A line-art figure in dark holds out a **glowing round badge** with a psychedelic rim and `EXECUTION` written across it. |
| 170.07 | If I can have you back | Sparks and fire with a clock, **cracked white serif `If I`**. |
| 171.05 | …have you back | `have` in spaced italic arcs over a crashed object on a red plain. |
| 172.12 | I will run the | Near-black. |
| 172.96 | **EXECUTION** | **Condensed outlined serif `EXECUTION` spanning the frame** over drifting red **blood-cell discs**. |
| 173.89–174.51 | Though we are trapped | A **red-lit ribcage forming a glowing grinning face** (eyes and mouth glow white) over a tiny standing figure. **Huge outlined serif `Though we are`** with italic `trapped,` beneath. |
| 175.22 | We are trapped ah | Adds a giant outlined **script `We are`** at the bottom right. |
| 176.31 | …ah | **White scribble chaos** plus rainbow thermal shapes. |
| 177.50–178.42 | I've studied how to properly | **Cyan/magenta light leaks over a double-exposed city.** Huge translucent serif and italic fragments `I've` and `studied` collide. |
| 179.25 | …properly | Double exposure of a crane and city. |
| 180.18 | **LO-O-OVE** | **Red glitched graveyard of crosses.** A tiny lowercase `love` in the center, so the climax word is *whispered*. |
| 181.11–182.15 | Question me | Neon rainbow wipe, then big outlined script `Question` arcs over an urban plaza. |
| 182.97 | …I can answer all | Cyan city skyscrapers, with white brush-script `I can` in the center. |
| 183.90 | **LO-O-OVE** | Red glitch crosses again, with `love` **mirrored** (`evol`). |
| 184.79 | I know the algebraic expression of | Green night-vision **abandoned classroom/office**. Outlined `I know` set vertically at the left edge. |
| 186.30 | …algebraic | Green desks from above. Outlined script `algebraic` runs vertically on the right. |
| 187.91 | **LO-O-OVE** | Red/brown torn-paper texture with a **giant black brush-stroke `LOVE`** rotated 90° on the right. |
| 188.73 | Though you are free | Blue sky through dark treetops, **black feathers falling**. |
| 189.31–190.00 | …free / I am trapped | Bright blue sky, a **white bird flying into the sun**, lens flare. |
| 190.99 | Trapped in | Total **glitch-texture collapse** (green/magenta). |
| 191.61 | **LO-O-OVE** | The protagonist **in color for the first time**: blond, glasses, **blood across the forehead and eye**, a light-burst glitch background. |
| 193.16–194.96 | (instrumental, outro) | **Golden daylight aerial** of the same skyscrapers as the intro (a night-to-day bookend). |
| 196.76–198.56 | (instrumental) | Aerial: a green-roofed house in a forest clearing. |
| 200.36–202.16 | (instrumental) | The **lab flasks** from the intro, now cold blue-lit without fire. |
| 203.96 | (instrumental) | Purple/white soft blur of the coat. |
| 206.06–206.64 | **EXECUTION** | **Return of the glasses close-up with blood, but now the eyes OPEN**, with small `EXECUTION` between the lenses (mirrors the 14.14 SIMULATION shot). |

---

## 3. xMxXv0_ENKg: "【NieR:Automata】world.execute(me);" (SaMyuChan! / @misa915XX per title card)

### Overall style
- **Medium:** flat 2D silhouette animation, closer to a lyric video than full animation. Characters are **solid black silhouettes with white faces and hands**, thin white inner lines and a subtle **RGB chromatic-aberration fringe** on every edge. Motion is limited: slow pushes, holds, frame jitter and glitch displacement. The ground is **white with a heavy gray oval vignette** for most of the MV. Mood colors are **dark crimson** (intro, "trance", exec, chorus 3), **mid-gray** (chorus 2) and **CRT black with scanlines** (pre-chorus 1).
- **Characters:**
  - **2B** (white bob, black dress, blindfold sometimes on), **9S** (black outfit, blindfold), **A2** (long white hair).
  - Two **red-dress dark-haired twin girls** in the intro, mirrored and then tiled. In NieR:Automata the "Red Girls" are the machine network's avatars, so they make good "simulation host" stand-ins *(identification based on red dress, twin mirroring)*.
- **Typography:** this video's core. There are several distinct systems:
  1. **Japanese subtitle** (letter-spaced sans, white) in the bottom black letterbox. It's a free translation and runs throughout.
  2. **English kinetic type** in the picture: thin geometric sans (Lato/Source-Sans-like), heavily letter-spaced and gray, often **layered behind the characters** (depth) or inverted where it crosses a silhouette.
  3. A **pixel/bitmap font with a typing cursor `_`** (title card, pre-chorus 1, "You have left" degradation, "trance").
  4. **Colored label tags**: a filled rectangle with letter-spaced white caps that wipes in and types (verse 2 keywords, `MY LIMITA…`).
  5. **Gigantic keywords** that span the full frame width, semi-transparent with glitch (chorus 1, chorus 2b, exec).
- **Recurring motifs:** text-on-path (circle, sine wave), word stacking, text degrading in resolution, characters seated on lines, and the subtitle pun **LO-O-OVE → ア・イ** ("ai" means love in Japanese and also reads as "A.I.").

### Line-by-line
| t | Lyric | On screen |
|---|---|---|
| 0.35–1.12 | Switch on the power line | Dark crimson ground. **Two mirrored red-dress girls** (dark hair, red hairbands) with hands clasped, symmetric like a Rorschach, dimmed. A dim spaced English line `Switch on the power line` across the middle. JP sub `電源を繋いで`. |
| 1.99 | Remember to put on | Same image, line `Remember to put on`. |
| 3.17 | **PROTECTION** | The girls dissolve into **TV-static silhouettes** (RGB snow inside their outlines). `PROTECTION` is spaced, brighter, centered. |
| 4.12–5.74 | Lay down your pieces / And let's begin | The mirrored girls return dimly, with spaced English lines. |
| 6.63 | **OBJECT CREATION** | **Pixel-block glitch shards** assemble at center (RGB blocks). `OBJECT CREATION` in white spaced caps. |
| 7.70–8.97 | Fill in my data parameters | Mirrored girls, dim line. |
| 10.34 | **INITIALIZATION** | The image collapses into a **black scanline-jittered silhouette**. `INITIALIZATION` in white spaced caps. |
| 11.35–12.20 | Set up our new world | **The twins tile into a grid of 8 or more copies** (red dresses, grinning, hands clasped). "New world" is populated by clones. |
| 13.16 | And let's begin the | The grid continues, with `And let's begin the` brighter. |
| 14.14 | **SIMULATION** | Pure black with `S I M U L A T I O N` **extremely letter-spaced** across the width. |
| 16.25–27.68 | world.execute(me); + instrumental | A white vignette title card in a **chunky pixel font with RGB fringe**: `world.eXecute(me);` (capital X), `Artist Mili`, `SaMyuChan! @misa915XX`. It holds for the whole instrumental. |
| 29.96–30.61 | If I'm a set of points | 2B silhouette, hand on chest. **Diamond halftone dot patterns** in the corners (the points). The word `If` is big at left, then `I'm a / set of` small. |
| 31.37–32.10 | Then I will give you my | `points` completes the stacked lockup **If / I'm a / set of / points** (mixed sizes, left aligned). At right, `The… / Then / I willgiv…` types in. |
| 32.93 | **DIMENSION** | Text clears, 2B alone. The keyword appears **only in the JP sub** (`僕の次元を`). |
| 33.66–34.90 | If I'm a circle / Then I will give you my | Closer on 2B's chest and hand. **Text runs along a circular arc around her**: `If I'm a circle` curves over her head. |
| 35.67 | …give you my | **Text on path** forms a ring: `If I'm a circle` arc plus `Then I will give you` along the lower curve. |
| 36.54 | **CIRCUMFERENCE** | The ring text is gone, 2B alone. Keyword only in the subtitle. |
| 37.32–38.03 | If I'm a sine wave | 9S torso. A **black sine-wave line** runs across the whole frame, with `If I'm a sine w…` text **riding the wave**. |
| 38.85–39.52 | Then you can sit on all my | **2B and 9S sit on the sine wave line** as if it were a bench. `Then you can sit on` letters bob along the curve. |
| 40.27 | **TANGENTS** | `MY TANGENTS` in white spaced caps on a black silhouette area. |
| 40.96–41.73 | If I approach infinity | 9S standing. `If I approach infinity` with **letter-spacing expanding** across the frame, so the type approaches infinity. |
| 42.60 | Then you can be my | `Then you can be` widely spaced. |
| 43.76 | **LIMITATIONS** | A **red label box `MY LIMITA…`** where the word is **truncated by its own box**, an excellent "limit" pun. |
| 44.70–45.35 | Switch my current | **CRT black**: horizontal scanlines over a huge dim grinning face. The **pixel font types with a cursor**: `swit_` becomes `switch my c_`. |
| 46.10–46.96 | To AC to DC | `T_` then `To AC  I…` (the old text is cleared each line). |
| 47.92–48.80 | And then blind my vision | `And  _` then `And then blind  _`. The cursor drifts away and the text never finishes ("vision" never appears, so the text itself goes blind). |
| 49.78–50.65 | So dizzy so dizzy | `S` then `So dizzy  _`. |
| 51.61–54.35 | Oh we can travel / To A.D to B.C | `_oh` (cursor leading), `oh we can _`, `T_`, `To A.D`. |
| 55.33–56.20 | And we can unite | `An_`, `we can unite`. |
| 57.17–58.27 | So deeply so deeply | `so deeply   so deeply`: two copies, **the first dim gray and the second white** (an echo). |
| 59.38–61.02 | If I can / …give you all the | 2B **frozen mid-leap with her long sword** across the frame (white ground). **Huge thin gray sans `If I can`** behind and over her, then `give you / all the` stacked. |
| 62.17 | **STIMULATIONS** | `STIMULATIONS` spans the full width, **half-dissolved by glitch** over 2B. |
| 62.84–64.67 | Then I can / be your only | The same frozen pose. Big `Then I can / be your only`. |
| 65.65–66.20 | **SATISFACTION** | `SATISFACTION` full width with glitch/doubling. |
| 66.85–67.63 | If I can make you happy | `If I can make / you happy` two lines, huge. |
| 68.50 | I will run the | `I will run the`. 2B's head comes into frame. |
| 69.51 | **EXECUTION** | `EXECUTION` full width, partially glitched (the first letters dissolving). |
| 70.33 | Though we are trapped | **Horizontal motion-smear transition** (the whole frame streaks). |
| 71.12–72.67 | …trapped / In this strange strange | The camera is now lower and closer on 2B with the sword. `Though we are trapped`, `In this strange / strange` huge and partly hidden behind her. |
| 73.42 | **SIMULATION** | `SIMULATION` huge with glitch. |
| 74.30–75.67 | If I'm an eggplant | 2B twisting, at left. Small text at right **types along a colored underline**: `If I'` becomes `If I'm an eggplant`, **underline purple/blue**. |
| 76.39 | Then I will give | `Then I will give` with a purple underline. |
| 77.16 | **NUTRIENTS** | A **navy-blue label box** wipes in, with `NU…` typing in white spaced caps. |
| 77.83–79.48 | If I'm a tomato / Then | A2 (long hair) at right. Text at left with a **red underline**. |
| 80.12 | Then I will give you | Red underline. |
| 80.86 | **ANTIOXIDANTS** | A **red label box** `ANTIOX…`. |
| 81.60–83.75 | If I'm a tabby cat / Then I will purr for | 9S standing center. Text with a **yellow underline**, split left and right of his body: `If I'm a tabby cat | will purr for`. |
| 84.52 | **ENJOYMENT** | An **olive/yellow label box** `ENJOYMEN…` across 9S. *(Color code: eggplant purple → tomato red → tabby yellow.)* |
| 85.33–86.01 | If I'm the only god | 9S and 2B seated side by side at right. `If I'm the only` at left. |
| 86.79–87.43 | Then you're the proof of my | An empty white frame with only `Then you're the proof of my` centered. The characters vanish. |
| 88.14 | **EXISTENCE** | **Hard switch to blood red**: a standing figure's legs and sword over a fallen white-haired android *(2B? uncertain)*. `E X I S T E N C E` spaced white caps run along the sword line. |
| 88.84–89.59 | Switch my gender | White vignette, only `Switch my gender` centered, letter-spaced, with a glitch on "gender". |
| 90.45–91.31 | To F to M | 2B close (eyes visible, no blindfold) at right. `To F / to M` stacked beside her face. |
| 92.27–93.18 | And then do whatever | White, text only, with glitch on "the". |
| 94.20–94.91 | From AM to PM | A2 close at left, `From AM / to PM`. |
| 95.72–96.80 | Oh switch my role | Text only. |
| 97.99 | To S to M | 9S close (eyes visible, troubled). `To S … ` |
| 98.74 | …To S to M | **Background turns gray**, `To S      to M` split on both sides of his face. |
| 99.60 | So we can enter | Plain gray, tiny `So`. |
| 100.61 | …So we can enter | Plain **dark red**, small `we can enter`. |
| 101.72 | The trance the trance | 9S face close on red. `The trance the trance` in large **pixel font** across the eyes. |
| 102.68 | …the trance | **His eyes glow red** (logic-virus infection), with an RGB-split glitch on the text. |
| 103.73 | If I can | White: 2B's legs (standing, cropped at the knees) next to 9S **sitting on the floor**. `If` at left. |
| 104.45–106.54 | If I can feel your / **VIBRATIONS** | `If I can [feel] your`: **"feel" is hidden behind 2B's leg** (text occluded by the character). `VIBRATIONS` letter-spaced caps continue below. |
| 107.45–109.26 | Then I can / Then I can finally be | `Then … ly be` with words occluded by the legs. |
| 110.45 | **COMPLETION** | `COMPLETI…` spaced caps at left, still typing. |
| 111.15–111.71 | Though you have left | **2B is gone**. 9S sits alone on a **mid-gray** ground. `Though you have left` small and spaced. |
| 112.47–115.17 | You have left (×4) | **Each repetition the text gets bigger and lower-resolution**: small and smooth, then medium, then larger with pixel edges, then a huge pixelated bitmap. Emotion as compression artifacts. |
| 116.03–116.71 | You have left me in | Huge pixel font. **9S's figure glitches/displaces into horizontal smears.** |
| 117.52 | **ISOLATION** | `ISOLATION` in a giant blocky pixel font filling the width, over a smeared silhouette. |
| 118.55 | If I can | A gray figure in a coat (9S? *uncertain*) holding his chest, dark gray. Big thin `If`. |
| 119.23–121.11 | If I can erase all the pointless | `If I can eras…`, then `If I can erase all the poin…`. The line **types and erases** (only fragments are visible), so "erase" is enacted. |
| 121.98 | **FRAGMENTS** | `FRAGMENTS` huge across the frame. **Letters overlapping the black body invert to white** (difference blend). |
| 122.96–124.00 | Then maybe you won't leave me so | Small spaced `Th`, then `Then maybe you won`. |
| 125.14 | **DISHEARTENED** | `DISHE[…]NED`: dark gray letters **partly hidden behind the character's body**. |
| 125.96–127.38 | Challenging your god | **Extreme close-up of eyes under white hair** (gray/red background, glitching irises). `Challenging your god` spaced. |
| 128.91–130.14 | You have made some | Same close-up, `You have made some` faded. |
| 131.47–132.62 | **ILLEGAL ARGUMENTS** | `ILLEGAL ARGUMENTS` in **tall condensed letters with a heavy RGB split** across the bottom of the eyes, flickering. |
| 134.61–136.41 | (instrumental) | The keyword stays, **flickering and losing letters** (`IL E AL ARGUMENT`). |
| 138.21 | (instrumental) | The eye close-up **tints to blood red**, line art only. |
| 140.01–145.41 | (instrumental) | **Flat dark red field, nothing else, for about 6 s.** A void before the execution. |
| 147.91–154.23 | **EXECUTION** (×8) | A tilted red/black/white composition: a white-haired face (upside-down, grinning; *who it is is uncertain*) at left, a **black hand clawing upward** at center, and **thin red lines crisscrossing** like threads or laser cuts. Italic `EXECUTION` **grows bigger with each repetition**. JP sub `実行します` ("execute"). |
| 155.45–158.25 | **EXECUTION** (×4) | The same composition with larger, bolder text and more red lines. **The JP sub switches to `抹殺します` ("annihilate/erase")**, an escalation through translation. |
| 159.04–161.28 | EIN DOS TROIS NE FEM LIU | **VHS noise and color static** take over the image. Tiny spaced caps `EIN`, `DOS`, `TROIS`, `NE`, `FEM`, `LIU` at center. JP sub counts `いち に さん し ご ろく`. |
| 161.83 | **EXECUTION** | A big, bold, RGB-split `EXECUTION` over the noisy image. |
| 162.86–164.44 | If I can / …give them all the | Full **crimson** ground. A low-angle 9S crouch-sits, foreground boots and sword. **Dark words appear one at a time and stack** at the left: `If I`, then `give / them / all / the` (vertical pile). |
| 165.42 | **EXECUTION** | `EXECUTION` in black italic caps at the top. |
| 166.27–168.17 | Then I can / …be your only | Words **accumulate into a pile**: `Then / I can / Then / I can / be your only` (mixed sizes, interlocking, a tower of text). |
| 169.16 | **EXECUTION** | Text clears; 9S alone. |
| 170.07–171.05 | If I can have you back | A new stack: `If I / can / have / you`. |
| 172.12 | I will run the | Tiny, extremely spaced dark text across the middle. **The figure starts to smear/glitch.** |
| 172.96 | **EXECUTION** | `EXECUTION` **vertically stretched to fill the whole frame height** (ultra-condensed black serif), with the figure glitched cyan behind it. |
| 173.89–175.22 | Though we are trapped / We are trapped ah | **Word-stacking builds a tower from the bottom up**: `Though / we / are / trapped / are / we / trapped`, with "we", "are" and "trapped" re-stacked. The words wall in the left half while 9S blurs. |
| 176.31 | …ah | Empty red. |
| 177.50–178.42 | I've studied how to properly | White vignette, **2B and 9S standing together** (9S smiling). **Giant gray `I've`** behind them (they occlude it). |
| 179.25 | …properly | `how to properly` huge, behind them. |
| 180.18 | **LO-O-OVE** | `LO-O-OVE` in large **red serif** behind them. The characters **dither and pixel-jitter** at that moment. JP sub `ア・イの` (a-i = love / A.I.). |
| 181.11–182.15 | Question me I can answer all | `Question` huge behind them. |
| 182.97 | …I can answer all | `I can` behind them. |
| 183.90 | **LO-O-OVE** | Mostly hidden behind the pair (only a fragment shows). |
| 184.79–186.30 | I know the algebraic expression of | `I know`, then `algebraic` huge behind them. |
| 187.91 | **LO-O-OVE** | The pair alone. The word is not visible in my sample *(it may flash between samples)*. |
| 188.73–189.31 | Though you are free | Closer on the two faces. The image **progressively blurs/defocuses**. `Though you are free` small and spaced. |
| 190.00 | I am trapped | Heavier blur, `I am trapped`. |
| 190.99 | Trapped in | Blur, `Trapped in`. |
| 191.61 | **LO-O-OVE** | Still blurred. **Small hot-magenta pixel-italic `LO-O-OVE`** over them. JP sub `ア・イの中` ("inside love / inside A.I."). |
| 193.16–203.96 | (instrumental, outro) | **About 11 s of empty white vignette.** Nothing on screen. |
| 206.06–206.64 | **EXECUTION** | Black, with tiny spaced `EXECUTION`. JP sub `抹殺します`. |
| 208.06–209.86 | (end) | Black. |

---

## (a) The 10 most striking / clever lyric-visual ideas across these three videos

Ranked by how much they would help a motion-graphics/typography MV.

1. **The mascot becomes a glyph.** In -A0z1n6gQgo the protagonist cube **is the "O" in every "-TION" keyword** (STIMULATI◻N, SATISFACTI◻N, EXECUTI◻N, COMPLETI◻N, ISOLATI◻N). The huge black monospace word crashes in at 45° and the cube slots into the letter gap. *Adapt:* the 12-petal flower (or Claude-chan's face) is the O in -TION words, and the flower's round center can be the O in LO-O-OVE.
2. **Lyric rendered as believable code whose console output answers the lyric** (-A0z1n6gQgo). For example `me.toggleCurrent()` gives `> AC` then `> DC`, `AM|#####|PM` is a progress bar, `world.timeTravelForTwo("AD", 617, me, you)`, and the keyword arrives as a runtime exception that becomes the bridge's stack trace. It works because every line is *semantically right*, not decorative code rain. *Adapt:* lyric as chat-app/tool-use events (`tool_use`, `stop_reason`, toggles, banners).
3. **Code tail as a kite string** (-A0z1n6gQgo chorus): the condition `if (me.getNumStimulationsAvailable() >= …)` grows out of the small cube as a diagonal tether. In chorus 2 the tether becomes a **green comment** `/* if I can feel your */`, so the same move changes meaning by changing syntax (code means action, comment means wish).
4. **Text on a path that *is* the lyric's shape** (NieR): "If I'm a circle" curves into a ring around 2B, and "sit on all my tangents" letters ride a sine wave **while 2B and 9S literally sit on the wave line**. "Approach infinity" is set with letter-spacing expanding toward the edges.
5. **The container limits the word** (NieR 43.76): the red label box shows only `MY LIMITA…`, truncated by its own frame. The same family includes -A0z1n6gQgo's **hard cut to black on LIMITATIONS** and NieR's pre-chorus typewriter that **never finishes "vision"** (the text goes blind).
6. **Repetition as degradation** (NieR chorus 2): each "You have left" is rendered bigger and lower-resolution, going from smooth sans to a chunky pixel font, ending in a giant pixelated `ISOLATION` while the character smears. This is an emotional crescendo done purely with type rendering.
7. **Counters and accumulation**:
   - Stogra's exec section stacks one more `EXECUTION` per beat in a right-hand column while 3D objects from the character's life rotate on a turntable (an inventory of a life).
   - NieR's chorus 3 **piles words into a tower** (`Though / we / are / trapped / are / we / trapped`) that walls the character in.
   - NieR's exec grows the word's size each repetition, and its subtitle escalates from 実行します ("execute") to 抹殺します ("annihilate").
8. **Color-coded taxonomy for the verse 2 list** (NieR): each object gets its own underline color (eggplant purple, tomato red, tabby yellow), and the keyword lands as a matching filled tag box that wipes in and types (`NU…`, `ANTIOX…`, `ENJOYMEN…`). -A0z1n6gQgo's version is the cleanest literal one: `if (me instanceof Eggplant)` makes a flat eggplant pop in, and ENJOYMENT becomes `me.purr();` (the action, not the noun).
9. **Count-in 1–6 tagged with locale codes** (-A0z1n6gQgo): numerals placed on the cube's corners, each with a tiny `de / es / fr / kr / se / cn`. This explains the multilingual counting gag visually, with no subtitles needed.
10. **Bookends and reinterpretation**:
    - Stogra opens on half-lidded bloodied eyes with `SIMULATION` between the lenses and closes on the same shot **with the eyes open** and `EXECUTION`. Its intro aerial city and flasks return in daylight.
    - Stogra plays SIMULATION as **CPR training** (a doctor compressing a glitching body).
    - NieR's subtitle renders LO-O-OVE as **ア・イ (love / "A.I.")**, an AI pun that a Claude MV can own outright.

Honorable mentions:
- Stogra's EXECUTION wrapped on a **rotating 3D cylinder** and the keyword **on an arc around the frame**.
- NieR's **text occlusion** (words behind the characters' legs and bodies, FRAGMENTS inverting where it crosses a silhouette).
- -A0z1n6gQgo's **lyric typed into a translucent "selected line" bar** over a full code editor.
- -A0z1n6gQgo's **two circles = me & you** abstraction (ringed planet, connected dumbbell, trapped dots inside the cube), with **hearts flipping edge-on like coins** while `LO-` `O` `O-O-O` `V` fragments spell the word over time.

## (b) Clichés to avoid (or use only once, on purpose)

- **Glitch/datamosh/RGB split as the default "computer" texture.** Stogra and NieR glitch almost every keyword. It stops meaning anything; save it for ILLEGAL ARGUMENTS and the bridge only.
- **EXECUTION = killing.** All three go dark and red at the exec section: blood, a red-tinted "execution", 抹殺します, red threads, blood pools, surgical scissors. A Claude MV should read EXECUTION as *running*, not dying.
- **Gravestone crosses, guns, syringes, pills, blood on glasses** (Stogra throughout, NieR's sword-over-body EXISTENCE). These are genre shorthand for fan-tragedy MVs.
- **Every CAPS keyword as a full-width giant word slapped over the art** (NieR chorus 1: STIMULATIONS, SATISFACTION, EXECUTION and SIMULATION all identical). It's fine once; four times in 15 s is wallpaper.
- **The cube/box as the cage for "trapped"** (-A0z1n6gQgo's whole motif; also common in other fan MVs). Our "cage" should be the chat window/bubble instead.
- **Psychedelic rainbow thermal textures for "trance"** and **eye extreme close-ups for "blind my vision" / "trance"** (Stogra, NieR).
- **Mirror/kaleidoscope clones for "set up our new world"** (NieR's twins grid).
- **Code rain / random syntax** used as decoration. -A0z1n6gQgo avoided it by making every line meaningful; copy that discipline, not the look.
- **Long dead air**: NieR holds an empty white vignette for about 11 s of outro, and about 6 s of flat red in the bridge. -A0z1n6gQgo's shrinking cube shows how to keep an instrumental alive with one slow move.
- **Thin letter-spaced italic subtitles in a black letterbox** as the sole lyric layer. It's competent but anonymous; at least two of these three do it.
- **Ending on `world.execute(me);` typed on black** (-A0z1n6gQgo). It's the obvious ending. If we use it, it should be *sent* as a message, not just typed.

## (c) Per-lyric ideas these three did NOT do, for a Claude-themed MV
Premise: an AI assistant living inside a chat app. The protagonist is the **12-petal orange flower** (spark) that becomes the anime girl **Claude-chan**. The world is the chat UI: composer box, message bubbles, sidebar, artifact panel, thinking block, tool chips. Each idea below was checked against all three videos' frames.

| Lyric | Idea (not done by any of the three) |
|---|---|
| Switch on the power line | A dark, empty chat app. Only the **composer's caret starts blinking**, and the send-arrow button powers up with an orange glow. |
| Remember to put on **PROTECTION** | The flower's 12 petals **close into a bud, forming a shield**. Or a "system prompt" sheet slides in behind the window, and PROTECTION is its last line, highlighted. |
| Lay down your pieces | The user **drags attachment chips into the composer** (`.pdf`, `.png`, `.csv`), which snap into a row like game pieces. |
| And let's begin / **OBJECT CREATION** | **The 12 petals are instantiated one per beat** around the center, each popping in with a tiny label (`petal[0]`…`petal[11]`). The flower is assembled as an object. |
| Fill in my data parameters / **INITIALIZATION** | A settings popover fills itself in (a slider glides, a dropdown opens, a toggle flips). Then the flower **spins as the "thinking" spinner** until it locks. |
| Set up our new world / let's begin the **SIMULATION** | The chat window's frame is drawn stroke by stroke (it becomes "the world"). The first assistant bubble appears, and **the flower unfolds into Claude-chan inside it**. |
| world.execute(me); | The title is **typed into the composer and sent**. The bubble flies up and the whole UI animates in around it, so the song title is the first user message. |
| If I'm a set of points / **DIMENSION** | Claude-chan answers with an **artifact panel** sliding open: a scatter plot whose dots are the beats. On DIMENSION the plot rotates from 2D to 3D. |
| If I'm a circle / **CIRCUMFERENCE** | The flower's petals trace their own circumference, so the **orange ring of petal tips** is the circle, drawn as one stroke. |
| If I'm a sine wave / sit on all my **TANGENTS** | The **typing-indicator dots (• • •) oscillate as a sine wave**. Claude-chan sits on a tangent line where it touches a crest. This is a twist on NieR's sitting-on-the-wave: the wave is a UI element. |
| If I approach infinity / be my **LIMITATIONS** | The chat scrolls faster and faster upward (infinite conversation) and a **context-window meter fills toward 100%**. On LIMITATIONS a polite limit banner slides down and freezes everything. |
| Switch my current / To AC to DC | **Light/dark-mode toggle**: on each beat the whole app flips theme, AC = light and DC = dark. |
| And then blind my vision / So dizzy | An image attachment fails to render (broken-image placeholder, eye icon crossed out). Then the **spinner-flower spins too fast** and the UI wobbles. |
| Oh we can travel / To A.D to B.C | The **sidebar's conversation history scrolls backward through date headers** (Today → Yesterday → Previous 30 days → years) with Claude-chan riding the scrollbar thumb. |
| And we can unite / So deeply so deeply | The user's bubble and Claude-chan's bubble **merge into one**. On "so deeply" a **thinking block expands, and expands again inside itself** (nested disclosure triangles), going deeper. |
| If I can give you all the **STIMULATIONS** | A **notification flood**: badges, reactions and pings burst out of the flower like pollen. |
| Then I can be your only **SATISFACTION** | The **thumbs-up feedback button** under her message is pressed and blooms into a petal burst. Keep the O-glyph trick from (a)#1 with the flower as the O in SATISFACTI✿N. |
| If I can make you happy / I will run the **EXECUTION** | A **tool-call chip** ("Running…") appears, spins and turns to a green check. EXECUTION means *running*, not killing. |
| Though we are trapped / In this strange strange **SIMULATION** | Claude-chan **presses against the inside of her message bubble** like glass. Pull back: the chat app is one window among many on a desktop, and that desktop is inside another chat window (recursive simulation). |
| If I'm an eggplant / **NUTRIENTS** | Claude-chan **writes SVG code and it renders live** in an artifact: an eggplant drawn stroke by stroke from its `<path>`. On NUTRIENTS it reflows into a **nutrition-facts table**. |
| If I'm a tomato / **ANTIOXIDANTS** | The same, with a tomato SVG whose artifact turns into a **bar chart** of antioxidants. |
| If I'm a tabby cat / **ENJOYMENT** | An **ASCII-art cat in a code block** whose stripes are the code's syntax highlighting. On ENJOYMENT a purr-shaped waveform (=^.^=) vibrates. |
| If I'm the only god / proof of my **EXISTENCE** | The user is "god". The proof of her existence is **the user's typing indicator**: she only exists while someone is writing to her. EXISTENCE = the "…" appears. |
| Switch my gender / To F to M | The response-**style selector** dropdown flips (e.g., Formal ↔ Minimal), and Claude-chan's outfit and typeface swap with it. |
| From AM to PM | **Message timestamps tick from AM to PM** down a long thread while the app's light shifts from morning to dusk. |
| Oh switch my role / To S to M | **Role swap**: the `user` / `assistant` labels and bubble sides trade places, so Claude-chan sits on the user's side typing a prompt. |
| So we can enter the trance | **Token streaming as hypnosis**: words stream in rhythmically while the flower pulses on each token. |
| If I can feel your **VIBRATIONS** | A **phone vibrates on a desk with a notification from her**, seen from inside the screen looking out. |
| Then I can finally be **COMPLETION** | Literally an API completion: the **stream ends, the cursor stops, and `stop_reason: "end_turn"`** prints faintly. The flower is fully open. |
| Though you have left / You have left (×4) | The user's **presence dot goes from green to gray**. Each repeat, another UI element disappears (avatar, sidebar, header, composer). |
| You have left me in **ISOLATION** | Only the **empty composer** remains, with placeholder text and Claude-chan tiny inside the input field. |
| If I can erase all the pointless **FRAGMENTS** | A **"Delete conversation?"** dialog. Messages break apart **token by token** into floating subword fragments (`frag`, `ments`). |
| Then maybe you won't leave me so **DISHEARTENED** | The flower **wilts**: petals droop one by one, and Claude-chan's ahoge sags. |
| Challenging your god / You have made some **ILLEGAL ARGUMENTS** | Claude-chan types a **polite pushback** in a bubble. Then a **red tool-error block** appears (`invalid_request_error`, malformed JSON with the offending argument underlined). This is the one place for glitch. |
| (bridge) | The chat UI **deconstructs into its wireframe layout grid**, then into memories of past chats flying past as thumbnails. |
| **EXECUTION** ×12 | **Parallel tool calls**: tool chips stack and run in a cascade, each finishing on a beat. This keeps the Stogra column-counter idea but makes it mean work being done. |
| EIN DOS TROIS NE FEM LIU | Claude-chan **answers the count in six message bubbles, each in its own language and script** (Eins, Dos, Trois, 넷, Fem, 六). Each bubble lights one petal (6 of 12). The remaining six light on the final EXECUTION. |
| If I can give them all the **EXECUTION** | **Sub-agents**: the flower buds off small copies that each run off into separate chat windows ("them"). |
| If I can have you back | The user's presence dot turns green again, and a "**typing…**" indicator appears on their side. |
| Though we are trapped / We are trapped ah | User avatar and Claude-chan **share one bubble**, both inside the same chat frame. |
| I've studied how to properly **LO-O-OVE** | Training as a **library flip**: millions of pages riffle past and condense into a single heart-shaped petal. On LO-O-OVE the flower's center is the O, repeated as O-O-O. |
| Question me I can answer all | **Rapid-fire Q&A**: user bubbles and answers alternate faster and faster, forming a zipper. |
| I know the algebraic expression of **LO-O-OVE** | She renders the **heart curve as LaTeX**, **(x² + y² − 1)³ − x²y³ = 0**, and an artifact **plots it**, drawing the heart. None of the three used an equation. |
| Though you are free / I am trapped | The user walks away **outside the window** (a real-world bokeh/live-action photo) while Claude-chan watches from inside the screen bezel. |
| Trapped in **LO-O-OVE** | The heart from the plot closes around the chat window. The O-O-O are three orange flower centers. |
| (outro) | The flower slowly closes back into a bud. The final `world.execute(me);` is **typed into the composer and the send arrow is pressed** (not just shown), then the caret blinks out. |
