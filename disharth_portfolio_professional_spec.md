# Technical Specification — Disharth Patel 3D Portfolio Website
**Document Type:** AI Coding Agent Prompt & Engineering Specification  

**Version:** 1.0.0  
**Author:** Disharth Patel  
**Target Environment:** Cursor / Claude Code / Windsurf (Agent Mode)

---

## 1. PROJECT BRIEF

You are acting as a **Senior Frontend Engineer and Creative Technologist** at a premium digital studio. Your mandate is to engineer a production-grade, 3D scroll-driven portfolio website for **Disharth Patel**, a Computer Science undergraduate at MIT ADT University, Pune, specialising in **Generative AI, Machine Learning, and Business Automation**.

The site must function as a professional career artifact — a living demonstration of technical capability, not a template. The experience should feel analogous to Apple's product launch pages or the IOI Interactive website: a **camera-driven narrative through immersive 3D scenes**, with every scroll increment advancing a story rather than revealing conventional page sections.

The aesthetic direction is: **precision-dark, AI-native, minimal**. No decorative gradients, no generic card grids, no warm-cream backgrounds. Every visual decision must be intentional and defensible against the brief.

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette

| Token           | Hex Value                    | Role                              |
|-----------------|------------------------------|-----------------------------------|
| `--bg-void`     | `#050508`                    | Page background (near-void dark)  |
| `--bg-surface`  | `#0D0D14`                    | Cards, panels, overlay surfaces   |
| `--accent`      | `#6C63FF`                    | Primary accent — electric violet  |
| `--accent-alt`  | `#00E5FF`                    | Secondary accent — data cyan      |
| `--text-primary`| `#F0F0F5`                    | Body and heading text             |
| `--text-muted`  | `#6B6B7A`                    | Labels, captions, metadata        |
| `--border`      | `rgba(108, 99, 255, 0.15)`   | Subtle borders on panels          |

Do not introduce any colours outside this palette without explicit justification in a code comment.

### 2.2 Typography

| Role        | Typeface        | Weight   | Size     | Notes                        |
|-------------|-----------------|----------|----------|------------------------------|
| Display     | Space Grotesk   | 700      | 72px     | Hero name only               |
| Heading 1   | Space Grotesk   | 600      | 48px     | Section titles               |
| Heading 2   | Space Grotesk   | 500      | 32px     | Project names, card titles   |
| Body        | Inter           | 400      | 16px     | All paragraph content        |
| Caption     | Inter           | 400      | 12px     | Tags, labels, metadata       |
| Monospace   | Not used        | —        | —        | Deliberately excluded        |

Load both typefaces via `next/font/google`. Line length must not exceed 72 characters on desktop. Do not use all-caps treatments, inline italic accents on single words, or spaced em-dash label patterns (`WORD — fragment`).

### 2.3 Motion Contract

| Trigger         | Owner           | Rule                                              |
|-----------------|-----------------|---------------------------------------------------|
| Scroll progress | GSAP ScrollTrigger | All scroll-driven camera moves and reveals    |
| Hover / Click   | React Spring    | All micro-interactions (scale, glow, colour)      |
| Page load       | GSAP timeline   | One orchestrated entry sequence per section       |
| Reduced motion  | CSS media query | Disable all GSAP; preserve fade-only transitions  |

CSS transitions must **never** drive scroll-dependent animation. React Spring must **never** touch scroll-derived values.

---

## 3. TECHNICAL STACK

### 3.1 Core Dependencies

```
Framework:        Next.js 14 — App Router, TypeScript strict mode
3D Engine:        Three.js r160+
3D Abstraction:   @react-three/fiber (React Three Fiber)
                  @react-three/drei (Drei helper library)
Animation:        gsap + @gsap/react (ScrollTrigger, ScrollSmoother)
                  @react-spring/three (micro-interactions)
Styling:          Tailwind CSS v3 + CSS custom properties
State:            Zustand (lightweight — no Redux overhead needed)
Performance:      next/dynamic (lazy Canvas loading, SSR: false)
                  web-vitals (runtime monitoring)
Linting:          ESLint + Prettier + TypeScript strict
Deployment:       Vercel (Edge Network, automatic HTTPS)
```

### 3.2 Constraints

- **No external `.glb` / `.gltf` model files.** All 3D geometry must be generated programmatically using Three.js primitives. This eliminates load-time risk and keeps the bundle lean.
- **Draco compression** must be pre-configured in the Three.js loader pipeline in the event that models are introduced in future iterations.
- **No CSS-in-JS libraries** (styled-components, Emotion). Tailwind + CSS custom properties only.
- **No jQuery or legacy DOM manipulation libraries.**
- TypeScript strict mode must be enabled. No `any` types permitted.

---

## 4. APPLICATION ARCHITECTURE

### 4.1 File Structure

```
/app
├── layout.tsx               # Root layout: fonts, metadata, Zustand provider
├── page.tsx                 # Page shell: renders all sections in sequence
└── globals.css              # CSS custom properties, resets, font declarations

/components
├── /canvas                  # All Three.js / R3F scene components
│   ├── HeroParticles.tsx    # Neural-network particle system
│   ├── AboutTunnel.tsx      # Camera tunnel + holographic card shader
│   ├── SkillGraph.tsx       # Force-directed 3D skill node graph
│   ├── ProjectStage.tsx     # Per-project 3D mesh (accepts variant prop)
│   ├── TimelinePath.tsx     # CatmullRom tube + camera tracking
│   └── ContactVoid.tsx      # Particle dissolution on section entry
└── /ui                      # All HTML overlay / interface components
    ├── Nav.tsx              # Floating nav bar + dot section indicators
    ├── HeroOverlay.tsx      # Name, title, and CTA text layer
    ├── AboutOverlay.tsx     # Bio paragraph + animated stat counters
    ├── ProjectCard.tsx      # Title, tags, stats, GitHub link per project
    └── ContactPanel.tsx     # Closing headline + contact link pills

/lib
├── store.ts                 # Zustand store: scrollProgress, activeSection, isMobile
├── gsapSetup.ts             # GSAP plugin registration and global config
├── particleUtils.ts         # Shared Three.js geometry and buffer helpers
└── constants.ts             # Design tokens, section data, project data as typed constants

/hooks
├── useScrollProgress.ts     # Normalised 0–1 scroll value per section
├── useReducedMotion.ts      # Reads prefers-reduced-motion media query
└── useMobileDetect.ts       # Sets isMobile flag on mount + resize

/types
└── index.ts                 # Shared TypeScript interfaces (Project, SkillNode, TimelineEvent)
```

### 4.2 Global State (Zustand)

```typescript
interface PortfolioStore {
  scrollProgress: number          // Global 0–1 scroll progress
  activeSection: number           // Index of current visible section (0–5)
  isMobile: boolean               // True if viewport width < 768px
  animationsDisabled: boolean     // True if prefers-reduced-motion is set
  setScrollProgress: (v: number) => void
  setActiveSection: (i: number) => void
}
```

---

## 5. SECTION SPECIFICATIONS

### Section 0 — Navigation (Persistent)

**Behaviour:**  
A fixed navigation bar persisting across all sections. Transparent over the hero; transitions to `--bg-surface` with `backdrop-filter: blur(12px)` once the user scrolls past 80% of the hero viewport height.

**Left side:** "DP" monogram in Space Grotesk 600, `--accent` colour.  
**Right side:** Six dot indicators. The active dot renders at 1.5× scale with a `--accent` drop-shadow glow. Inactive dots render in `--text-muted`.

**Dot activation:** Driven by `IntersectionObserver` on each section element, with a 50% threshold. On intersection, update `store.activeSection`.

**Mobile (< 768px):** Dots are hidden. A hamburger icon (3 lines, 24px, `--text-primary`) opens a full-height slide-in drawer listing section labels. Tap navigates via smooth scroll and closes the drawer.

---

### Section 1 — Hero

**3D Scene: `HeroParticles.tsx`**  
A neural-network particle system of 3,000 nodes (800 on mobile) distributed within a sphere of radius 8 units. Edges are drawn as `LineSegments` between any two particles within a distance threshold of 1.5 units, up to a maximum of 6,000 edges total. Particles drift slowly along randomised velocity vectors and reverse on boundary collision.

**Entry animation (2 seconds, runs once on mount):**  
Particles initialise at radius 30 (scattered) and GSAP-tween inward to their final positions. Material opacity tweens from 0 → 1 simultaneously.

**Mouse parallax:**  
Map normalised mouse position `(-1, 1)` to camera `x` offset ±0.5 and `y` offset ±0.3. Lerp camera toward target at factor 0.05 per frame to create smooth lag.

**UI Overlay: `HeroOverlay.tsx`**

```
DISHARTH PATEL                 — Space Grotesk 700, 72px, --text-primary
Generative AI · ML · Automation  — Inter 400, 18px, --text-muted
[ Explore Work ↓ ]             — Pill button, --accent border, smooth scroll
```

The CTA button triggers smooth scroll to Section 2 on click.

---

### Section 2 — About

**3D Scene: `AboutTunnel.tsx`**  
ScrollTrigger pins this section. As scroll progress `p` advances from 0 → 1:
- `camera.position.z` lerps from `8 → 2` (moves forward through the particle field, creating a tunnel effect)
- A flat `PlaneGeometry(3, 4)` card mesh scales from `0 → 1` and rotates on Y from `π → 0` (materialises and flips into view)

The card uses a custom `ShaderMaterial` that renders: a dark surface base, animated edge-glow in `--accent`, and a subtle scanline effect via `sin(uv.y * 40 + time) * 0.03` added to the alpha channel. This creates a holographic display aesthetic without any external texture assets.

**UI Overlay: `AboutOverlay.tsx`**  
Two-column layout. Left column holds bio copy. Right column holds three animated stat counters that count up from 0 on section activation.

**Bio copy (final, production-ready):**
> I build systems where AI meets real business problems — from candidate-ranking pipelines that process over 100,000 profiles to sales dashboards that reduced reporting time by 80%. Currently pursuing B.Tech Computer Science Engineering at MIT ADT University, Pune, graduating July 2027.

**Stat counters:**

| Value       | Label             |
|-------------|-------------------|
| 8.11 / 10   | CGPA              |
| 4           | Major Projects    |
| 2           | Certifications    |

---

### Section 3 — Skills

**3D Scene: `SkillGraph.tsx`**  
A 3D force-directed graph. Each skill is represented as a `SphereGeometry` node. Edges are drawn as `Line` components between logically related skills. Node colour is determined by cluster membership.

**Cluster definitions and colour mapping:**

| Cluster          | Colour Token    | Skills                                                        |
|------------------|-----------------|---------------------------------------------------------------|
| Generative AI    | `--accent`      | Prompt Engineering, Microsoft Copilot, AI Agents, ChatGPT     |
| ML / Data Science| `--accent-alt`  | Scikit-learn, Pandas, NumPy, Matplotlib, Deep Learning        |
| Business Intel   | `#FFD166`       | Power BI, MS Excel, SQL, Market Research, Data Storytelling   |
| CS Fundamentals  | `--text-primary`| Python, DSA, OOP, DBMS, OS, Computer Networks                 |
| MLOps            | `#A8FF78`       | MLOps Pipelines, Model Deployment, Git, GitHub                |

**Force simulation (run once on mount, CPU-side, outside `useFrame`):**  
Run 200 iterations. Apply spring attraction between connected nodes, coulomb repulsion between all node pairs, and a centering force toward the world origin. Write final positions into a ref; never recalculate in `useFrame`.

**Interaction:**
- `raycaster` hit on node N → scale N to 1.5× via React Spring, set all non-adjacent nodes to opacity 0.3, brighten N's edges to opacity 0.9. Show a `@react-three/drei Html` tooltip with the skill label.
- Node click → pulse emissive intensity from 1 → 3 → 1 over 400ms.

**Scroll entry:** Nodes animate from the world origin outward to their computed positions when the section enters the viewport.

---

### Section 4 — Projects

**Layout:** A pinned horizontal scroll container. The outer container spans `300vh`. The inner rail spans `300vw` as a flex row. GSAP ScrollTrigger translates the rail leftward as the user scrolls, keeping one panel in viewport at a time.

**Scroll mapping:**  
`rail.translateX = -scrollProgress * (railWidth - viewportWidth)`  
`activePanel = Math.floor(scrollProgress * 3)` — triggers panel-specific animations.

---

**Panel A — Intelligent Candidate Discovery & Ranking System**  
*2026 · Redrob AI India Runs Hackathon*

**3D Mesh:** A subdivided `BoxGeometry` with a wireframe overlay and solid emissive core. Rotates slowly on the Y-axis. Emissive intensity pulses via `sin(time * 1.5)`. Represents computational processing — a chip/processor metaphor.

**Metrics:** 100K+ Profiles Processed · 2-Stage Pipeline · Hackathon Project  
**Stack tags:** Python · SQL · BAAI/bge-small Embeddings · Streamlit · Semantic Similarity  
**Description:** AI-powered candidate evaluation system combining rule-based pre-filtering with transformer-based semantic similarity scoring. Implements normalised ranking across skills, education, experience, and job relevance. Built under CPU-only hackathon constraints with a Streamlit dashboard for results presentation.

---

**Panel B — Sales Analytics Dashboard**  
*MySQL + Power BI*

**3D Mesh:** An array of `BoxGeometry` bars at varying heights, representing a bar chart extruded into 3D space. On panel activation, bars grow from height 0 to their final values over 800ms (staggered per bar). On each frame, bars oscillate slightly via a sine wave for subtle life.

**Metrics:** 150K+ Transactions · 80% Reduction in Reporting Time · 4 Years of Data  
**Stack tags:** MySQL · Power BI Desktop · Power Query · ETL  
**Description:** End-to-end automated sales analytics pipeline. Processes and normalises transactional data across four years, with currency normalisation to INR. Delivers an interactive Power BI dashboard with revenue tracking, market segmentation, top-customer analysis, and temporal filtering.

---

**Panel C — Netflix Recommendation System**  
*January – May 2025*

**3D Mesh:** A miniature node graph (a reduced-scale instance of the SkillGraph component) where nodes represent film titles and edges represent recommendation relationships. Nodes drift gently on each frame — no force simulation, purely aesthetic motion.

**Metrics:** Hybrid ML Model · Full EDA Pipeline · Collaborative + Content-Based  
**Stack tags:** Python · Scikit-learn · Pandas · NumPy · Matplotlib  
**Description:** Personalised film recommendation engine combining collaborative filtering and content-based methods. Includes a full data preprocessing and exploratory data analysis pipeline using Pandas and NumPy, with Matplotlib visualisations of model performance and data distribution.

---

### Section 5 — Certifications & Education

**3D Scene: `TimelinePath.tsx`**  
A `TubeGeometry` generated from a `CatmullRomCurve3` that winds through 3D space. The camera travels along this path as the user scrolls, and the tube itself is revealed progressively using the geometry's `drawRange`.

**Path points** (one per timeline event, spaced with sinusoidal X/Z variation):  
`position = Vector3(sin(i * 0.8) * 3, i * -1.5, cos(i * 0.8) * 2)`

**Timeline events:**

| Date       | Event                                              |
|------------|----------------------------------------------------|
| Aug 2023   | B.Tech CSE commences — MIT ADT University, Pune   |
| Jan 2025   | Netflix Recommendation System                      |
| May 2025   | Commodity Price Comparison & Visualisation System  |
| Sep 2025   | Intellipaat × IIT Indore AI & Data Science cert    |
| Feb 2026   | Professional Certification completed               |
| 2026       | Candidate Ranking System — Hackathon               |
| Jul 2027   | B.Tech graduation (expected)                       |

Each event renders a glowing `SphereGeometry` node at its path position, with a `@react-three/drei Html` label panel displaying the date and description.

**Scroll mapping:**
```
camera.position = curve.getPoint(scrollProgress) + [0, 0, 2]
camera.lookAt   = curve.getPoint(min(scrollProgress + 0.05, 1.0))
drawRange.count = scrollProgress * totalTubeSegments * 3
```

The NPTEL Design and Analysis of Algorithms certificate renders as a distinct floating badge node off the main path, connected by a short branch curve.

---

### Section 6 — Contact

**3D Scene: `ContactVoid.tsx`**  
On section entry, GSAP tweens all remaining particle positions outward to radius 50 over 1.5 seconds, and tweens particle opacity to 0. This leaves a clean void — the visual metaphor for openness and invitation.

Simultaneously, UI overlay elements fade in with a staggered delay of 80ms per element.

**UI Overlay: `ContactPanel.tsx`**

```
Let's build something.                    — Space Grotesk 700, 56px, centred
Open to Generative AI roles, research,
and internships.                          — Inter 400, 18px, --text-muted, centred
```

Three contact link pills, rendered as a centred flex row:

| Label                      | Target                              |
|----------------------------|-------------------------------------|
| disharthpatel@gmail.com    | `mailto:disharthpatel@gmail.com`    |
| GitHub                     | Profile URL                         |
| LinkedIn                   | Profile URL                         |

Each pill: `border: 1px solid --accent`, transparent background. On hover (React Spring): background fills to `--accent`, text colour inverts, `scale: 1.04`, `box-shadow: 0 0 16px --accent`.

---

## 6. PERFORMANCE REQUIREMENTS

### 6.1 Rendering Budget

| Condition                     | Particle Count | Pixel Ratio Cap |
|-------------------------------|---------------|-----------------|
| Desktop (≥ 1024px)            | 3,000         | 2.0             |
| Tablet (768px – 1023px)       | 1,500         | 1.5             |
| Mobile (< 768px)              | 800           | 1.0             |
| `prefers-reduced-motion: reduce` | 0 (disabled) | N/A           |

### 6.2 `useFrame` Contract

- `useFrame` must only contain: buffer attribute writes, uniform updates, and lerp/damping calculations.
- All physics simulations, force layouts, and edge detection must execute **outside** `useFrame` — on mount or in a Web Worker if computation exceeds 16ms.
- Use `delta`-based updates exclusively. Never rely on `Date.now()` inside `useFrame`.

### 6.3 Memory Management

Every Canvas component must implement the following cleanup in `useEffect`:

```typescript
return () => {
  geometry.dispose()
  material.dispose()
  texture?.dispose()
  ScrollTrigger.getAll().forEach(t => t.kill())
}
```

### 6.4 Loading Strategy

- All Canvas components must be imported via `next/dynamic` with `{ ssr: false }`.
- Each Canvas component must be wrapped in `<Suspense fallback={<SectionSkeleton />}>`.
- `SectionSkeleton` renders a dark placeholder with a single subtle pulse animation (CSS only, no JS).

### 6.5 Target Metrics (Lighthouse, Production Build)

| Metric                         | Target   |
|--------------------------------|----------|
| Performance                    | ≥ 85     |
| Accessibility                  | ≥ 95     |
| Best Practices                 | ≥ 90     |
| First Contentful Paint         | < 1.5s   |
| Largest Contentful Paint       | < 2.5s   |
| Cumulative Layout Shift        | < 0.1    |

---

## 7. ACCESSIBILITY REQUIREMENTS

- All interactive elements (nav dots, project GitHub links, contact pills) must have visible `:focus-visible` styles in `--accent`.
- `aria-label` attributes are required on all icon-only buttons (hamburger, dot indicators).
- `prefers-reduced-motion` must disable all GSAP animations. Static sections with opacity-only transitions must be displayed instead.
- Colour contrast ratio between `--text-primary` on `--bg-void` must meet WCAG AA (≥ 4.5:1). Verify programmatically.
- All `<Canvas>` elements must include `aria-hidden="true"` — they are decorative; all meaningful content is in HTML overlays.

---

## 8. PSEUDOCODE — COMPONENT LOGIC

### 8.1 Global Bootstrap

```
PROCEDURE bootstrap():
  LOAD Space Grotesk, Inter via next/font/google
  REGISTER gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
  
  INIT store:
    scrollProgress  ← 0
    activeSection   ← 0
    isMobile        ← window.innerWidth < 768
    animationsDisabled ← matchMedia('prefers-reduced-motion').matches
  
  IF animationsDisabled:
    SET global flag → skip all GSAP initialisation
    RENDER static layout with opacity-only CSS transitions
  
  RENDER TREE:
    <Nav />
    <HeroSection />     // Section 0
    <AboutSection />    // Section 1
    <SkillsSection />   // Section 2
    <ProjectsSection /> // Section 3
    <TimelineSection /> // Section 4
    <ContactSection />  // Section 5
```

---

### 8.2 HeroParticles

```
PROCEDURE initHeroParticles(isMobile):
  N ← isMobile ? 800 : 3000
  
  positions  ← Float32Array(N * 3)   // xyz per particle
  velocities ← Float32Array(N * 3)   // drift per particle
  edges      ← []                    // vertex pairs for LineSegments

  FOR i ← 0 TO N - 1:
    positions[i]  ← randomPointInSphere(radius=8)
    velocities[i] ← randomVector(magnitude=0.002)

  FOR each particle A:
    FOR each particle B (B ≠ A):
      IF distance(A, B) < 1.5 AND edges.length < 6000:
        edges.PUSH([A, B])

  // Entry animation (runs once)
  TWEEN positions FROM randomSphere(radius=30) TO finalPositions OVER 2s
  TWEEN material.opacity FROM 0 TO 1 OVER 2s

PROCEDURE onFrame(delta, mouse):
  FOR i ← 0 TO N - 1:
    positions[i] ← positions[i] + velocities[i] * delta * 60
    IF positions[i].length > 8:
      velocities[i] ← velocities[i] * -1   // boundary reversal

  UPDATE positionBuffer.needsUpdate ← true

  // Mouse parallax
  targetX ← mouse.x * 0.5
  targetY ← mouse.y * 0.3
  camera.position.x ← LERP(camera.position.x, targetX, 0.05)
  camera.position.y ← LERP(camera.position.y, targetY, 0.05)
```

---

### 8.3 AboutTunnel

```
PROCEDURE initScrollTrigger():
  ScrollTrigger.create({
    trigger: '#about',
    start:   'top top',
    end:     'bottom top',
    pin:     true,
    scrub:   1,
    onUpdate: (self) → updateAbout(self.progress)
  })

PROCEDURE updateAbout(p):  // p ∈ [0, 1]
  camera.position.z ← LERP(8, 2, p)
  card.scale        ← LERP(0, 1, p)
  card.rotation.y   ← LERP(PI, 0, p)
  overlay.opacity   ← LERP(0, 1, clamp(p * 2, 0, 1))

SHADER: HolographicCard
  FRAGMENT:
    edgeGlow  ← 1 - smoothstep(0.0, 0.05, min(uv.x, uv.y, 1-uv.x, 1-uv.y))
    scanline  ← sin(uv.y * 40.0 + uTime) * 0.03
    finalColor ← mix(surfaceColor, accentColor, edgeGlow + scanline)
    OUTPUT    ← vec4(finalColor, opacity)
```

---

### 8.4 SkillGraph

```
PROCEDURE buildForceLayout(nodes, edges):
  // Run entirely on mount — NOT in useFrame
  REPEAT 200 times:
    FOR each node A:
      force ← Vector3(0, 0, 0)
      
      FOR each node B (B ≠ A):
        delta    ← A.position - B.position
        distance ← delta.length()
        
        IF (A, B) in edges:
          // Spring attraction
          force += delta.normalize() * -0.05 * (distance - 2.0)
        ELSE:
          // Coulomb repulsion
          force += delta.normalize() * 0.5 / (distance² + 0.001)
      
      // Centering
      force += A.position * -0.02
      
      A.velocity += force
      A.velocity *= 0.85   // damping
      A.position += A.velocity

PROCEDURE onNodeHover(hitNode):
  FOR each node:
    IF node == hitNode OR node in hitNode.neighbours:
      SPRING node.scale TO 1.5
      SPRING node.opacity TO 1.0
    ELSE:
      SPRING node.scale TO 1.0
      SPRING node.opacity TO 0.3

  FOR each edge:
    IF edge connects to hitNode:
      SPRING edge.opacity TO 0.9
    ELSE:
      SPRING edge.opacity TO 0.1

  SHOW Html tooltip at hitNode.position: hitNode.label
```

---

### 8.5 ProjectsSection

```
PROCEDURE initHorizontalScroll():
  railWidth ← 3 * window.innerWidth

  ScrollTrigger.create({
    trigger: '#projects',
    start:   'top top',
    end:     '+=' + (railWidth - window.innerWidth),
    pin:     true,
    scrub:   1,
    onUpdate: (self) → updateRail(self.progress)
  })

PROCEDURE updateRail(p):
  translateX    ← -p * (railWidth - window.innerWidth)
  rail.style    ← `transform: translateX(${translateX}px)`
  activePanel   ← Math.floor(p * 3)

  IF activePanel changed:
    TRIGGER panel entry animation for panels[activePanel]

PROCEDURE PanelEntryAnimation(variant):
  SWITCH variant:
    CASE 'chip':   // Panel A
      TWEEN mesh.rotation.y from 0 to 2π over 1s
      TWEEN emissiveIntensity from 0 to 1 over 0.5s

    CASE 'bars':   // Panel B
      FOR each bar (staggered by 50ms):
        TWEEN bar.scale.y from 0 to finalHeight over 800ms EASE out

    CASE 'nodes':  // Panel C
      FOR each node (staggered by 30ms):
        TWEEN node.position from origin to finalPosition over 600ms
```

---

### 8.6 TimelinePath

```
PROCEDURE buildTimeline(events):
  points ← events.map((event, i) →
    Vector3(
      sin(i * 0.8) * 3,
      i * -1.5,
      cos(i * 0.8) * 2
    )
  )

  curve    ← CatmullRomCurve3(points, closed=false)
  geometry ← TubeGeometry(curve, tubularSegments=200, radius=0.05)
  
  // Set initial draw range to 0 (tube hidden until scroll begins)
  geometry.setDrawRange(0, 0)

PROCEDURE onScrollUpdate(p):  // p ∈ [0, 1]
  // Reveal tube progressively
  visibleSegments ← Math.floor(p * geometry.index.count)
  geometry.setDrawRange(0, visibleSegments)
  geometry.attributes.position.needsUpdate ← true

  // Advance camera along path
  camPoint         ← curve.getPoint(clamp(p, 0, 1))
  lookAheadPoint   ← curve.getPoint(clamp(p + 0.05, 0, 1))

  camera.position ← camPoint + Vector3(0, 0.5, 2)
  camera.lookAt(lookAheadPoint)
```

---

### 8.7 ContactVoid

```
PROCEDURE onSectionEntry(particlePositions, particleRef):
  // Dissolve particles outward
  FOR each particle i:
    direction ← randomUnitVector()
    TWEEN positions[i] TO direction * 50 OVER 1.5s EASE in

  TWEEN particleRef.material.opacity TO 0 OVER 1.5s

  // Staggered UI reveal
  FOR each overlayElement (indexed j):
    TWEEN overlayElement.opacity FROM 0 TO 1
    DELAY j * 80ms
    OVER 600ms

PROCEDURE onPillHover(pill):
  SPRING pill.backgroundColor TO '--accent'
  SPRING pill.color TO '--bg-void'
  SPRING pill.scale TO 1.04
  APPLY boxShadow: 0 0 16px '--accent'

PROCEDURE onPillLeave(pill):
  SPRING pill.backgroundColor TO 'transparent'
  SPRING pill.color TO '--text-primary'
  SPRING pill.scale TO 1.0
  REMOVE boxShadow
```

---

### 8.8 Navigation

```
PROCEDURE initNav():
  observer ← IntersectionObserver(
    callback: (entries) →
      FOR entry in entries:
        IF entry.isIntersecting:
          store.activeSection ← entry.target.dataset.sectionIndex
    options: { threshold: 0.5 }
  )

  FOR each section element:
    observer.observe(section)

PROCEDURE onScroll(scrollY, heroHeight):
  IF scrollY < heroHeight * 0.8:
    nav.style.background ← 'transparent'
    nav.style.backdropFilter ← 'none'
  ELSE:
    nav.style.background ← 'var(--bg-surface)'
    nav.style.backdropFilter ← 'blur(12px)'

PROCEDURE renderDots(activeSection):
  FOR i ← 0 TO 5:
    dot.scale   ← (i == activeSection) ? 1.5 : 1.0
    dot.color   ← (i == activeSection) ? '--accent' : '--text-muted'
    dot.shadow  ← (i == activeSection) ? '0 0 8px --accent' : 'none'
    dot.ariaLabel ← sectionLabels[i]
```

---

## 9. BUILD SEQUENCE

Execute in the following order to avoid dependency and scroll-wiring conflicts:

```
PHASE 1 — Foundation (Day 1)
  ├── 1. Initialise Next.js 14 project with TypeScript strict mode
  ├── 2. Install all dependencies, configure Tailwind + CSS tokens
  ├── 3. Implement Zustand store, hooks (useScrollProgress, useReducedMotion)
  ├── 4. Implement GSAP registration module
  └── 5. Build Nav component in static state (no scroll logic yet)

PHASE 2 — 3D Scene Construction (Days 2–4, one scene per session)
  ├── 6.  HeroParticles — particle system, entry animation, mouse parallax
  ├── 7.  AboutTunnel   — camera tunnel, holographic card shader
  ├── 8.  SkillGraph    — force layout, node render, hover interaction
  ├── 9.  ProjectStage  — three mesh variants (chip / bars / nodes)
  ├── 10. TimelinePath  — CatmullRom tube, camera tracking, draw range
  └── 11. ContactVoid   — dissolution effect, pill interactions

PHASE 3 — Scroll Integration (Day 5)
  ├── 12. Wire GSAP ScrollTrigger to each section
  ├── 13. Implement IntersectionObserver → Nav dot activation
  └── 14. Implement horizontal project rail scroll

PHASE 4 — Quality & Delivery (Day 6)
  ├── 15. Mobile responsive pass (particle count scaling, layout adjustments)
  ├── 16. Reduced-motion fallback implementation
  ├── 17. Accessibility audit (focus states, aria-labels, contrast ratios)
  ├── 18. Lighthouse performance audit — address any metric below target
  ├── 19. Open Graph image, page metadata, robots.txt
  └── 20. Deploy to Vercel, verify production build
```

---

*End of specification. All sections above constitute the complete, authoritative build contract for this project. Do not introduce design or architectural decisions outside this document without updating the specification first.*
