---
name: Email Guardian
description: A dark neon terminal for exploring spam and phishing classification.
colors:
  background: '#0a0a0f'
  foreground: '#e0e0e0'
  card: '#12121a'
  muted: '#1c1c2e'
  muted-foreground: '#a1a4b4'
  dim: '#6b7280'
  accent: '#00ff88'
  accent-secondary: '#ff00ff'
  accent-tertiary: '#00d4ff'
  border: '#2a2a3a'
  input: '#12121a'
  ring: '#00ff88'
  destructive: '#ff3366'
typography:
  display:
    fontFamily: '''Orbitron'', ''Share Tech Mono'', monospace'
    fontSize: clamp(46px, 5.4vw, 76px)
    fontWeight: 800
    lineHeight: 1.14
    letterSpacing: .015em
  headline:
    fontFamily: '''Orbitron'', ''Share Tech Mono'', monospace'
    fontSize: clamp(28px, 3.1vw, 42px)
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: .025em
  scanner-title:
    fontFamily: '''Orbitron'', ''Share Tech Mono'', monospace'
    fontSize: clamp(26px, 3.2vw, 38px)
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: .025em
  panel-title:
    fontFamily: '''Orbitron'', ''Share Tech Mono'', monospace'
    fontSize: 20px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: .025em
  body:
    fontFamily: '''JetBrains Mono'', ''Consolas'', monospace'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.75
  editor:
    fontFamily: '''JetBrains Mono'', ''Consolas'', monospace'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: '''Share Tech Mono'', monospace'
    fontSize: 12px
    fontWeight: 400
  navigation:
    fontFamily: '''Share Tech Mono'', monospace'
    fontSize: 14px
    fontWeight: 400
    letterSpacing: .08em
  button:
    fontFamily: '''JetBrains Mono'', ''Consolas'', monospace'
    fontSize: 13px
    fontWeight: 600
    letterSpacing: .07em
  score:
    fontFamily: '''JetBrains Mono'', ''Consolas'', monospace'
    fontSize: 22px
    fontWeight: 600
rounded:
  square: 0px
spacing:
  space-1: 8px
  space-2: 16px
  space-3: 24px
  space-4: 32px
  space-6: 48px
  space-8: 64px
  space-12: 96px
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.background}'
    typography: '{typography.button}'
    padding: 13px 22px
    height: 52px
  button-primary-hover:
    backgroundColor: '{colors.foreground}'
  button-outline:
    backgroundColor: transparent
    textColor: '{colors.accent}'
    padding: 10px 16px
    height: 48px
  button-cancel:
    backgroundColor: transparent
    textColor: '{colors.accent-secondary}'
    padding: 10px 16px
    height: 48px
  button-text:
    backgroundColor: transparent
    textColor: '{colors.accent}'
    typography: '{typography.label}'
    padding: 8px 0
    height: 44px
  example-chip:
    backgroundColor: transparent
    textColor: '{colors.muted-foreground}'
    typography: '{typography.label}'
    padding: 8px 10px
    height: 44px
  example-chip-selected:
    backgroundColor: '#00ff880a'
    textColor: '{colors.accent}'
  editor:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    typography: '{typography.editor}'
    rounded: '{rounded.square}'
    padding: 20px 16px
  panel:
    backgroundColor: '{colors.card}'
    padding: 32px
  analysis:
    backgroundColor: '{colors.background}'
    padding: 32px
  navigation-current:
    textColor: '{colors.accent}'
    typography: '{typography.navigation}'
  session-row:
    backgroundColor: transparent
    textColor: '{colors.foreground}'
    padding: 16px
    height: 72px
  session-row-selected:
    backgroundColor: '#00ff8808'
---

# Design System: Email Guardian

## Overview

**Creative North Star: "Neon message intercept"**

Email Guardian uses the user-pinned cyberpunk/glitch world: a void-black ground, neon signals, angular technical frames and terminal typography. Green leads actions, cyan carries analysis and magenta creates interruptions. The visual energy supports a school demonstration whose text input and two model outputs remain clear.

The materials are made in code: a faint grid, SVG noise, CRT scanlines, outlined icons and chamfered frames. Occasional headline corruption, a terminal cursor and slow border emission provide atmosphere. The shared pause control stops animations across both surfaces, and the system reduced-motion preference removes animation and reduces transitions.

**Key Characteristics:**

- Mandatory dark surfaces with green, magenta and cyan signals.
- Orbitron headings, JetBrains Mono reading text and Share Tech Mono labels.
- Chamfered frames, thin borders and restrained neon emission.
- Readable supporting text, visible focus and text-backed result semantics.
- Code-native textures and stoppable motion; no shipping raster imagery.

## Colors

Frontmatter records the actual CSS custom-property palette. Dark mode is mandatory (`color-scheme: dark`); names below describe usage.

### Primary

**Signal green** (`accent`) identifies launch/scan actions, selected examples, current navigation and legitimate classifications. `ring` shares this value for focus.

### Secondary

**Interruption magenta** (`accent-secondary`) differentiates the phishing explanation, cancel action and glitch fragments. It is not the risk classification color.

### Tertiary

**Data cyan** (`accent-tertiary`) carries analysis labeling, ordinary score fills and technical signals.

### Neutral

**Void black** (`background`) is the page, editor and analysis ground. **Panel black** (`card`) separates the composer and terminal preview. `input` declares the same panel value, while the actual textarea uses `background`. **Recessed indigo** (`muted`) backs terminal bars, meter tracks and loading rows. **Technical border** (`border`) divides structure.

**Reading gray** (`foreground`) carries principal copy; **supporting gray** (`muted-foreground`) carries paragraphs, placeholders and compact labels. **Decorative gray** (`dim`) remains declared but is not assigned to reading text. The supplied decorative gray (#6b7280) is intentionally replaced by the brighter supporting gray (#a1a4b4) for AA reading contrast on dark surfaces.

**Risk pink-red** (`destructive`) carries risk classification, validation errors and risk meter fills, always accompanied by text or icons.

**The Readable Signal Rule.** Use muted-foreground for supporting reading text and placeholders. Keep dim for decorative use only; it is not the reading-text color.

**The Meaning Beyond Color Rule.** Pair risk, safe, selected and error states with text, icons or semantic control state. Green is also the action color, so color alone cannot explain a result.

## Typography

**Display Font:** Orbitron, with Share Tech Mono and monospace fallbacks.
**Body Font:** JetBrains Mono, with Consolas and monospace fallbacks.
**Label Font:** Share Tech Mono, with monospace fallback.

Local Fontsource Latin assets bundle Orbitron (800), JetBrains Mono (400 and 600), and Share Tech Mono (400). The three packages are pinned at (5.3.0); their licenses ship in `front_end_react/public/font-licenses/`. No external font request is required. Heavy geometric headings contrast with steady monospace reading text.

### Hierarchy

- **Display:** The hero uses `display`. At compact desktop it becomes (57px), at stacked tablet `clamp(46px, 8.3vw, 68px)`, and at narrow mobile `clamp(37px, 10.3vw, 49px)` with line height (1.22).
- **Headline:** Intro/FAQ headings use `headline`, becoming (34px) at stacked tablet and (28px) on narrow mobile. Process uses `clamp(30px, 3.5vw, 44px)` and closing uses `clamp(32px, 4vw, 54px)`, both reducing to (28px) on narrow mobile.
- **Scanner/panel title:** These use frontmatter roles. Scanner title reduces to (29px), then (25px); composer title reduces to (17px). Waiting/result headings are (23px)/(22px); waiting uses line height (1.5).
- **Body/editor:** The page uses `body`, textarea `editor`. Supporting text commonly ranges (11–13px), with dense text at line height (1.8–1.9). Hero detail reaches (49ch), analysis copy (40ch), and expanded explanation (78ch).
- **Labels/navigation:** Share Tech Mono metadata and utilities range (10–14px). Uppercase and tracking distinguish functional technical labels. These are not a reusable decorative preheading treatment.
- **Scores:** The `score` role uses tabular numerals, as do character counts and class-score details.

**The Three Voices Rule.** Use Orbitron for display and major headings, JetBrains Mono for reading and numerical scores, and Share Tech Mono for compact labels and navigation.

## Layout

Header, landing, scanner and footer share a centered maximum content width (1280px) with desktop gutters (32px). The spacing scale is in frontmatter. Header minimum height is (96px). The hero uses (1.5fr / 1fr) columns, a (48px) gap and padding (88px 0 100px). The scanner pairs composer/analysis (1.13fr / .87fr) with a (1px) gap; grid columns use `minmax(0, ...)`.

The landing alternates a split hero, slanted capability rail, staggered model explainers, numbered process and native FAQ disclosures. Those are landing compositions rather than mandatory layouts for every surface.

| Inclusive maximum width | Implemented change |
| --- | --- |
| 1100px | Header gap (40px), nav gap (24px), school-demo badge hidden; hero gap (32px) and top padding (64px); composer/analysis padding (24px); keyboard hint hidden. |
| 800px | Header height (80px), gutters (24px), third nav link hidden; hero, perspectives, FAQ and scanner workspace stack. Preview follows the action, right-aligned up to (560px); decorative offset/caption hide. Capability rail becomes two columns. Composer/analysis padding (28px). Session rows stack and empty-analysis forced line break disappears. |
| 480px | Header height (76px), header gutters (16px), content gutters (20px). Hero action fills width; model explainers become one column; process padding (32px 20px). Composer/analysis padding (24px 20px). Example/process trailing icons hide; scan actions wrap and primary action flexes to fill space. Footer groups stack. |
| 360px | Header gutters (12px), header/nav gaps (8px). Session-count badge minimum width (18px), padding (1px 3px), type (10px), preserving the compact header after results exist. |

Keep mobile task order: input before analysis. Preview text wraps anywhere; textarea stays vertically resizable. The actual breakpoint set replaces the obsolete 1050/760/400 system.

## Elevation & Depth

Dark tonal layers, thin technical borders and local emission create depth. There is no general raised-card shadow. The hero terminal uses `drop-shadow(0 12px 30px #00000090)` and a rotated outline behind it. The faint grid repeats at (48px); SVG fractal noise has opacity (.035); page CRT scanlines have opacity (.45). All remain pointer-transparent.

The sidecar records the exact standard/small/large green, magenta and cyan glow tokens. Standard green supports outline-action hover and scan line; small green supports focus, editor focus and current navigation; magenta supports cancel hover; cyan supports the terminal edge. The large green token is declared but not currently applied. Primary hover uses a small green drop shadow; empty/loading analysis icons have a subtle cyan halo.

**The Emission, Not Lift Rule.** Use dark tonal layers and thin boundaries for structure; neon glow reinforces a signal or interaction rather than turning every surface into a floating card.

## Shapes

Surfaces are square or angular, with no rounded-card system. The shared eight-point chamfer polygon defaults to a (12px) cut; primary actions use (7px), terminal/workspace frames (14px), and process region (20px). The polygon cuts all four corners: `polygon(0 var(--cut), var(--cut) 0, calc(100% - var(--cut)) 0, 100% var(--cut), 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, var(--cut) 100%, 0 calc(100% - var(--cut)))`. Frames use an outer boundary layer and (1px) inset content. Straight (1px) rules organize fields/rows; primary borders are (2px). Primary focus removes clipping to reveal its outline.

Authored inline SVG icons use a (24px) viewBox, (1.5) stroke, rounded caps/joins and contextual sizes commonly (14–20px). Rounded icon paths do not create rounded surface tokens. `public/guardian.svg` is an authored code-native brand mark. No shipping raster imagery requires image provenance.

## Components

### Buttons

Green-filled primary actions are chamfered with dark text, uppercase JetBrains Mono and minimum height (52px). Hover changes fill/border to foreground gray and adds green emission; active shifts down (1px). The terminal outline action has minimum height (48px) and becomes green-filled with emission on hover. Cancel uses magenta outline/fill; green text actions underline on hover. Disabled controls use opacity (.5) and a not-allowed cursor.

Control feedback takes (150ms); transforms use `cubic-bezier(.16, 1, .3, 1)`. Shared keyboard focus uses a (2px) green outline, offset (5px) and small glow. Touch targets generally reach (44px).

### Chips

Synthetic sample controls are square outlined buttons, minimum height (44px), with `aria-pressed`. Hover/selection use green border/text and faint wash. They wrap with (8px) gaps; mobile hides icons but keeps names. Landing choices use text with selected underline. Selection loads editable text; scanning is a separate action.

### Cards / Containers

Terminal and scanner share chamfered frames. The composer uses panel black; analysis uses page black with a (1px) division. Desktop padding is (32px), with responsive overrides in Layout. Model results stay flat divided rows. Terminal framing uses a recessed header, square status dots and bordered message preview.

### Inputs / Fields

The square editor uses page-black fill, (1px) border and readable placeholder. Focus changes the outer boundary to green with small emission; textarea also retains a (1px) inset outline at offset (-4px). Minimum height is (220px), caret green, padding as in frontmatter. Toolbar and count row use straight dividers. Errors add risk boundary and alert text/icon. Clear text returns focus.

### Navigation

The rail places a green shield beside the two-line Email Guardian name. Share Tech Mono links use muted default and green hover/current states; current route adds a glowing (2px) underline. Counts appear only after results exist. At stacked width, the third link hides while Overview, Scanner and the (44px) motion toggle remain. The focus-revealed skip link reaches main content.

### Analysis, scores and session rows

Waiting, loading and results share the same analysis area. Loading shows a green sweep over outlined mail and thin pulsing rows with descriptive text and cancellation. Results use a square status icon, explicit classifications, real scores and native flat meters. Normal fill is cyan, risk fill destructive. Native disclosures reveal both class scores; the caveat stays visible. Session buttons use flat separators and faint green hover/selection. Selecting one focuses the result heading.

Result arrival is opacity-only (250ms). Headline glitch repeats (9s), cursor (1.4s), border emission (8s), scan sweep (2.5s), loading pulse (2s), second row delayed (.4s). Shared pause stops every animation, including pseudo-elements. `prefers-reduced-motion: reduce` disables animations, uses auto scrolling and reduces transition duration to (.01ms). Cursor/glitch decoration stays hidden from assistive text duplication.

## Do's and Don'ts

### Do:

- Do retain the mandatory dark palette and the three locally bundled font families.
- Do use muted-foreground for supporting copy and keep reading contrast independent of texture.
- Do preserve the shared motion pause control and reduced-motion treatment.
- Do retain keyboard focus, text-backed result states and native score disclosures.
- Do stack the editor before analysis and keep navigation usable at the 360px breakpoint.
- Do label synthetic examples and keep the model caveat visible.

### Don't:

- Don't revive the obsolete cobalt/white visual system.
- Don't use dim as paragraph, placeholder or small-label reading text.
- Don't add light mode, rounded card styling or stock raster artwork to this pinned world.
- Don't imply live inbox protection, guaranteed safety, benchmark accuracy or numerical loading progress.
- Don't turn descriptive labels into decorative preheading kickers.
