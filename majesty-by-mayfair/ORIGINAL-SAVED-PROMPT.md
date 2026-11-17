# Majesty by Mayfair – Claude Code Build Prompt

Copy everything below the line into Claude Code.

---

## Role and goal

You are a senior creative developer from an Awwwards-winning studio. Build a single-page, scroll-driven, ultra-luxury landing page for **Majesty by Mayfair**, a gated community of 410 ultra-luxury villas in Kollur, Hyderabad, by the developer Mayfair. The site is used as a Google Ads landing page, so it must look like a Site of the Day winner and still convert to site-visit enquiries.

Core thought: **Above & Beyond.** The feeling must be entering a private estate at golden hour, not browsing a property listing. Luxury must feel quiet, effortless and cinematic. Every section must have its own signature motion moment. No generic fade-ups everywhere.

## Tech stack

- Next.js (App Router) with TypeScript and Tailwind CSS
- GSAP with ScrollTrigger and SplitText-style line and character splitting
- Lenis for smooth scrolling, synced to the GSAP ticker
- Three.js via React Three Fiber, plus custom GLSL shaders for the hero and transitions
- Framer Motion only for small UI states such as the menu and modal
- next/image and next/font. Lazy-load anything heavy below the fold
- Must respect prefers-reduced-motion with a calm, static fallback

## Brand system

- Logo: a gold tree-of-life emblem in a circle, with the wordmark MAJESTY and BY MAYFAIR beneath. I will place the files at /public/brand/emblem.svg and /public/brand/wordmark.svg
- Colours: Forest #0D1813, Moss #18261E, Olive Leaf #2C3F33, Ivory #F3EDE2, Sand #DCCDB1, Stone #A99D88, Champagne Gold #C9A467, Gold highlight #E7C88E
- Type: a high-contrast display serif for headlines, such as Canela, Ogg or Italiana as a free option. A clean geometric sans for body text, such as Neue Montreal or Jost. A wide, tracked uppercase face for small labels
- Texture: a subtle animated film grain over the whole page, at roughly 4 to 6% opacity
- Layout: large negative space, hairline gold rules, editorial grids, oversized numbers

## Motion principles

- Easing: expo.out and custom cubic-bezier(0.22, 0.8, 0.18, 1). Nothing bouncy
- Durations of 1.2 to 1.8 seconds for reveals. Scrubbed animations tied to scroll for storytelling
- Headlines reveal line by line from behind masks
- Images reveal through clip-path wipes and scale from 1.2 to 1.0
- A custom cursor: a gold ring that grows into a labelled disc such as VIEW, DRAG or EXPLORE over interactive items
- Magnetic buttons that pull gently towards the cursor
- Target 60fps. Pause WebGL when it is offscreen

## Section-by-section build

### 1. Preloader

A black-green screen. The gold emblem draws itself stroke by stroke, then its leaves fill in. A thin gold progress line runs underneath with a counter from 000 to 100. Then the screen splits into two curtains and reveals the hero. Total of about 2.5 seconds.

### 2. Hero, a living shader scene

A full-screen WebGL hero. Use a full-bleed villa render or drone video at golden hour (placeholder: /public/media/hero.mp4). Over it, run a custom shader of slow flowing mist in forest green and champagne gold, which reacts softly to the mouse. Headline: "Above & Beyond", huge serif, each character rising from a mask. Subline: "410 private residences in Kollur, set among baobabs from Kenya and olive trees from France." As the user scrolls, the camera rises: the video scales and lifts, the mist thins, and the headline drifts upward and fades. This is the Above & Beyond moment.

### 3. Full-screen navigation

A minimal top bar with the emblem on the left, a "Book a Site Visit" button and a MENU button. MENU opens a full-screen overlay that wipes down in forest green. Large serif section names appear one by one, each showing a small image preview on hover. The bar turns to frosted glass after scrolling, and hides on scroll down and returns on scroll up.

### 4. Philosophy

An ivory section. One long statement in display serif: "Majesty is not about building large homes. It is about a setting where architecture, landscape, privacy and experience arrive together." Words go from 15% to 100% opacity as the user scrolls. Then four pillars, Rarity, Nature, Thoughtfulness and Distinction, each with a gold rule that draws across as it enters.

### 5. Numbers band

A moss-green band with four oversized counters that roll up like a slot machine: 410 villas, 3 plot sizes, 1,008 sq. yds. largest plot, 61 rarest residences. Each sits on a hairline gold rule.

### 6. Residences, a pinned 3D showcase

Pin this section for about 300% of the viewport height. Scrolling moves through three collections. Each has a large render that morphs into the next through a liquid displacement shader:

- **The 450 Residence:** 450 sq. yds. plot, 217 villas, from ₹45 Cr
- **The 630 Residence:** 630 sq. yds. plot, 132 villas, from ₹60 Cr
- **The 1,008 Residence:** 1,008 sq. yds. plot, 61 villas, from ₹80 Cr

Huge outlined numerals slide horizontally with parallax beside each render. A thin gold elevation line drawing draws itself over the render on scroll. Add spec rows, progress dots and a filling gold rail. Mark prices as indicative and sizes as plot areas, not built-up areas.

### 7. Landscape, a horizontal scroll journey

A sand-coloured section that pins and scrolls sideways. Cards: The Baobab (Kenya), The Olive (France), The Central Zen Park, The Lake-view Deck, and Walking & Jogging Trails. Each tall image reveals with a clip-path wipe and moves at its own speed inside its frame. Botanical names in italic. The cursor shows DRAG. WebGL leaf particles drift through.

### 8. Clubhouse

An infinite marquee of huge serif words, Wellness, Spa, Cold Plunge, Leisure, Dining, alternating solid and outlined, speeding up and skewing with scroll velocity. Below it, an accordion: Wellness (spa, sauna, cold plunge, swimming), Fitness (fitness centre, trails), Social & Dining (social spaces, café, dining), Recreation (indoor recreation, entertainment). Hovering a category reveals a floating image that follows the cursor. Use thin gold line icons, never glossy 3D icons.

### 9. The Experience Centre

An ivory vertical timeline whose gold spine draws down with scroll. Chapters: The Land, The Trees, The Planning, The Materials, then The Jaguar E-Type as a full-bleed image that zooms out from a close detail to the full car.

### 10. Location

An animated moss-and-gold map. The Outer Ring Road is a dashed ring. Gold routes draw from Kollur to Kokapet, the Financial District and Gachibowli, with a pulsing marker on Kollur. Travel times stay as placeholders marked "to be confirmed".

### 11. Gallery

A WebGL image grid that ripples like water as it moves, with a fullscreen lightbox on click.

### 12. Book a Site Visit

A dark section with a giant faded emblem rotating slowly behind. Floating-label form: name, mobile, email, residence of interest as pill buttons, preferred visit date. Also build a site-visit modal that opens from every CTA, a sticky gold button on mobile, and a WhatsApp button. Leave submission as a CRM stub and fire a placeholder Google Ads conversion event.

### 13. Large-type footer

A giant MAJESTY wordmark across the full width that rises letter by letter. Small links, a RERA placeholder, an artistic-impressions disclaimer, and contact details.

## Content rules

- Use only these facts: 410 villas; plots of 450, 630 and 1,008 sq. yds. with 217, 132 and 61 villas; baobabs from Kenya and olive trees from France; a Central Zen Park; a lake-view deck; a clubhouse with spa, sauna, cold plunge, swimming, fitness centre, café and dining; the Experience Centre with the Jaguar E-Type; Kollur, near the ORR, Kokapet, the Financial District and Gachibowli
- Never invent bedroom counts, built-up areas, distances, acreage or a RERA number. Show clear placeholders
- Copy is short, calm and confident. No exclamation marks, no "best" or "world-class"

## Responsiveness

Design for desktop, tablet and mobile from the start. On mobile, swap pinned horizontal scroll for swipeable cards, simplify shaders, disable the custom cursor and keep the hero headline readable. No horizontal overflow at 360px.

## Quality bar

Before finishing, review each section: would it win Awwwards Site of the Day? If a section only fades in, redesign its motion. Aim for mobile Lighthouse performance above 80, with focus states and alt text.

## Assets I will provide

Logo SVGs, a hero video or renders, three villa renders, landscape and clubhouse images, and Experience Centre photos. Until then, use tasteful placeholders from one local folder so they are easy to swap.
