# Majesty by Mayfair – Final Website Build Prompt

Copy everything below the line into any AI website builder (Claude Code, Lovable, Bolt, v0, Cursor and similar).

---

## Role and goal

You are a senior creative developer from an Awwwards-winning studio. Build a single-page, scroll-driven, ultra-luxury landing page for **Majesty by Mayfair**, a gated community of 410 ultra-luxury villas in Kollur, Hyderabad, by the developer Mayfair. The site is used as a Google Ads landing page, so it must look like a Site of the Day winner and still convert to site-visit enquiries.

Core thought: **Above & Beyond.** The feeling must be walking into a private forest estate at first light, early morning, with mist drifting through the trees. It must not feel like browsing a property listing. Luxury must feel quiet, effortless and cinematic. Every section must have its own signature motion moment. No generic fade-ups anywhere.

## Overall mood (important)

- The homepage opens **dark and moody**: a deep forest at dawn, before sunrise. Dark greens, near-black shadows, soft cool light through the trees.
- **Animated fog / mist** rolls slowly across the hero in layers, and reacts gently to the mouse.
- As the user scrolls, the page moves **from dark to bright**, like the sun rising: dark forest hero, then brighter ivory and sand sections, ending with a calm dark enquiry section.
- **Do not** use an overall yellow or golden-hour tone. Gold is only an accent (thin lines, numbers, buttons, the logo).
- **No cars anywhere.** No Jaguar, no vehicle images, no car animations.

## Tech stack

- Next.js (App Router) with TypeScript and Tailwind CSS
- GSAP with ScrollTrigger and SplitText-style line and character splitting
- Lenis for smooth scrolling, synced to the GSAP ticker
- Three.js via React Three Fiber, plus custom GLSL shaders for the fog hero, gallery and transitions
- Framer Motion only for small UI states such as the menu and modal
- next/image and next/font. Lazy-load anything heavy below the fold
- Must respect prefers-reduced-motion with a calm, static fallback

If the tool cannot run Next.js, build the same design as a single HTML file using GSAP, ScrollTrigger and Lenis from a CDN, with the fog drawn on a canvas.

## Brand system

- Logo: a gold tree-of-life emblem in a circle, with the wordmark MAJESTY and BY MAYFAIR beneath. Place the files at /public/brand/emblem.svg and /public/brand/wordmark.svg
- Colours: Forest #0D1813, Moss #18261E, Olive Leaf #2C3F33, Ivory #F3EDE2, Sand #DCCDB1, Stone #A99D88, Champagne Gold #C9A467, Gold highlight #E7C88E. Add Mist #CFD8D2 (pale grey-green) for the fog
- Type: a high-contrast display serif for headlines, such as Canela, Ogg or Italiana as a free option. A clean geometric sans for body text, such as Neue Montreal or Jost. A wide, tracked uppercase face for small labels, such as Michroma
- Texture: a subtle animated film grain over the whole page, at roughly 4 to 6% opacity
- Layout: large negative space, hairline gold rules, editorial grids, oversized numbers

## Imagery

- Use high-quality **stock photos** (Unsplash or Pexels, free licence) throughout: misty forest at dawn, modern luxury villas, landscaped gardens, baobab and olive trees, a lake at sunrise, spa and pool interiors, clubhouse dining.
- All photos must share one colour grade: deep greens, soft morning light, slightly desaturated. Nothing over-saturated or yellow.
- Keep every image in one local folder (/public/media/) with clear names (hero-forest.jpg, villa-450.jpg and so on) so they are easy to swap for real renders later.
- Every image needs alt text.

## Motion principles

- Easing: expo.out and custom cubic-bezier(0.22, 0.8, 0.18, 1). Nothing bouncy
- Durations of 1.2 to 1.8 seconds for reveals. Scrubbed animations tied to scroll for storytelling
- Headlines reveal line by line from behind masks
- Images reveal through clip-path wipes and scale from 1.2 to 1.0, with gentle parallax inside their frames
- A custom cursor: a gold ring that grows into a labelled disc such as VIEW, DRAG or EXPLORE over interactive items
- Magnetic buttons that pull gently towards the cursor
- Section-to-section transitions: colour of the page background shifts smoothly as each section enters (dark to bright as the "sun rises")
- Target 60fps. Pause WebGL when it is offscreen

## Section-by-section build

### 1. Preloader

A black-green screen. The gold emblem draws itself stroke by stroke, then its leaves fill in. A thin gold progress line runs underneath with a counter from 000 to 100. Wisps of fog start to drift in at the edges. Then the screen splits into two curtains and reveals the hero. Total of about 2.5 seconds.

### 2. Hero, a misty forest at dawn

A full-screen, **dark** hero. Background: a deep forest at early morning, before sunrise, with tall trees in silhouette and cool light through the canopy (stock photo or video; placeholder /public/media/hero-forest.jpg or hero-forest.mp4).

Over it, run a custom WebGL fog shader: 3 to 4 layers of slow-rolling mist in pale grey-green, moving at different speeds for depth. The fog parts softly around the mouse cursor. Light rays (god rays) fade in slowly through the trees.

Headline: "Above & Beyond", huge serif in ivory, each character rising from a mask through the fog. Subline: "410 private residences in Kollur, set among baobabs from Kenya and olive trees from France." Gold "Book a Site Visit" button and a small "Scroll" indicator.

As the user scrolls, the camera rises through the trees: the forest image scales and lifts, the fog thins and clears, the light gets brighter, and the headline drifts upward and fades. This is the Above & Beyond moment, from dark forest into the bright estate.

### 3. Full-screen navigation

A minimal top bar with the emblem on the left, a "Book a Site Visit" button and a MENU button. MENU opens a full-screen overlay that wipes down in forest green. Large serif section names appear one by one, each showing a small image preview on hover. The bar turns to frosted glass after scrolling, and hides on scroll down and returns on scroll up.

### 4. Philosophy

A bright ivory section (the "sunrise" moment). One long statement in display serif: "Majesty is not about building large homes. It is about a setting where architecture, landscape, privacy and experience arrive together." Words go from 15% to 100% opacity as the user scrolls. Then four pillars, Rarity, Nature, Thoughtfulness and Distinction, each with a gold rule that draws across as it enters and a small image that reveals with a clip-path wipe.

### 5. Numbers band

A moss-green band with four oversized counters that roll up like a slot machine: 410 villas, 3 plot sizes, 1,008 sq. yds. largest plot, 61 rarest residences. Each sits on a hairline gold rule.

### 6. Residences, a pinned showcase

Pin this section for about 300% of the viewport height. Scrolling moves through three collections. Each has a large villa photo that morphs into the next through a liquid displacement shader:

- **The 450 Residence:** 450 sq. yds. plot, 217 villas, from ₹45 Cr
- **The 630 Residence:** 630 sq. yds. plot, 132 villas, from ₹60 Cr
- **The 1,008 Residence:** 1,008 sq. yds. plot, 61 villas, from ₹80 Cr

Huge outlined numerals slide horizontally with parallax beside each image. A thin gold elevation line drawing draws itself over the image on scroll. Add spec rows, progress dots and a filling gold rail. Mark prices as indicative and sizes as plot areas, not built-up areas.

### 7. Landscape, a horizontal scroll journey

A sand-coloured section that pins and scrolls sideways. Cards: The Baobab (Kenya), The Olive (France), The Central Zen Park, The Lake-view Deck, and Walking & Jogging Trails. Each tall image reveals with a clip-path wipe and moves at its own speed inside its frame. Botanical names in italic. The cursor shows DRAG. WebGL leaf particles drift through, and a light morning mist lingers at the bottom of the frame.

### 8. Clubhouse

An infinite marquee of huge serif words, Wellness, Spa, Cold Plunge, Leisure, Dining, alternating solid and outlined, speeding up and skewing with scroll velocity. Below it, an accordion: Wellness (spa, sauna, cold plunge, swimming), Fitness (fitness centre, trails), Social & Dining (social spaces, café, dining), Recreation (indoor recreation, entertainment). Hovering a category reveals a floating image that follows the cursor. Use thin gold line icons, never glossy 3D icons.

### 9. The Experience Centre

An ivory vertical timeline whose gold spine draws down with scroll. Chapters: The Land, The Trees, The Planning, The Materials, The Craft. Each chapter has an image that reveals with a clip-path wipe and a short line of text. **No car or vehicle in this section.**

### 10. Location

An animated moss-and-gold map. The Outer Ring Road is a dashed ring. Gold routes draw from Kollur to Kokapet, the Financial District and Gachibowli, with a pulsing marker on Kollur. Travel times stay as placeholders marked "to be confirmed".

### 11. Gallery (a hero section of its own)

A full, immersive gallery of 12 to 16 stock photos (villas, forest, landscape, clubhouse, lake, interiors).

- A WebGL image grid in a masonry layout that ripples like water as it moves, with images tilting slightly on scroll velocity
- Filter tabs: All, Residences, Landscape, Clubhouse, Interiors, with images re-arranging smoothly when a tab changes
- Hover: image zooms gently, a gold caption slides up, the cursor shows VIEW
- Click: a fullscreen lightbox with a clip-path open animation, next and previous arrows, swipe on mobile, keyboard arrows and Esc to close
- Images reveal with a staggered clip-path wipe as the section enters

### 12. Book a Site Visit

A dark forest section (the evening return). A giant faded emblem rotates slowly behind, with soft fog drifting across the bottom. Floating-label form: name, mobile, email, residence of interest as pill buttons, preferred visit date. Also build a site-visit modal that opens from every CTA, a sticky gold button on mobile, and a WhatsApp button. Leave submission as a CRM stub and fire a placeholder Google Ads conversion event.

### 13. Large-type footer

A giant MAJESTY wordmark across the full width that rises letter by letter. Small links, a RERA placeholder, an artistic-impressions disclaimer, and contact details.

## Content rules

- Use only these facts: 410 villas; plots of 450, 630 and 1,008 sq. yds. with 217, 132 and 61 villas; baobabs from Kenya and olive trees from France; a Central Zen Park; a lake-view deck; a clubhouse with spa, sauna, cold plunge, swimming, fitness centre, café and dining; the Experience Centre; Kollur, near the ORR, Kokapet, the Financial District and Gachibowli
- Never invent bedroom counts, built-up areas, distances, acreage or a RERA number. Show clear placeholders
- Copy is short, calm and confident. No exclamation marks, no "best" or "world-class"
- No cars, no Jaguar, no vehicles anywhere on the site

## Responsiveness

Design for desktop, tablet and mobile from the start. On mobile, swap pinned horizontal scroll for swipeable cards, simplify shaders (keep a lighter fog), disable the custom cursor and keep the hero headline readable. No horizontal overflow at 360px.

## Quality bar

Before finishing, review each section: would it win Awwwards Site of the Day? If a section only fades in, redesign its motion. Check that the hero is dark with visible moving fog, that the page brightens as you scroll, and that there is no car anywhere. Aim for mobile Lighthouse performance above 80, with focus states and alt text.

## Assets I will provide later

Logo SVGs, real villa renders, landscape and clubhouse images, and Experience Centre photos. Until then, use the stock photos described above from one local folder so they are easy to swap.
