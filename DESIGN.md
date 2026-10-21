---
name: "Smart Email Guardian"
description: "Cobalt actions and cool white surfaces for a school email-scanning demonstration."
colors:
  blue: "#244dcc"
  blue-dark: "#1939a5"
  ink: "#202c47"
  muted: "#596780"
  line: "#dce2ef"
  soft-blue: "#edf2ff"
  white: "#fff"
  safe: "#23633d"
  risk: "#a52a2a"
  page: "#f5f7fc"
  analysis: "#eef3ff"
  focus: "#456deb"
  editor-border: "#bbc7dc"
  analysis-copy: "#53648b"
  analysis-heading: "#263e75"
  score-track: "#d8e2f5"
  score-fill: "#5072cb"
  risk-fill: "#b84242"
  safe-tint: "#deeee5"
  risk-tint: "#f8e2df"
  pressed: "#dce5ff"
  button-disabled: "#6379b6"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "2rem"
    fontWeight: 710
    lineHeight: 1.2
    letterSpacing: "-.035em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.625rem"
    fontWeight: 680
    lineHeight: 1.35
    letterSpacing: "-.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.25rem"
    fontWeight: 680
    lineHeight: 1.35
    letterSpacing: "-.025em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: ".9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: ".8125rem"
    fontWeight: 600
    lineHeight: 1.6
  metadata:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: ".75rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  key: "4px"
  chip: "7px"
  control: "8px"
  editor: "10px"
  workspace: "18px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  panel: "28px"
  roomy: "32px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.blue-dark}"
  button-primary-disabled:
    backgroundColor: "{colors.button-disabled}"
  button-secondary:
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    padding: "10px 14px"
    height: "44px"
  button-text:
    textColor: "{colors.blue}"
    typography: "{typography.label}"
    padding: "6px 2px"
    height: "40px"
  example-chip:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.chip}"
    padding: "7px 10px"
    height: "40px"
  example-chip-selected:
    backgroundColor: "{colors.soft-blue}"
    textColor: "{colors.blue-dark}"
  editor:
    textColor: "{colors.ink}"
    rounded: "{rounded.editor}"
  workspace:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.workspace}"
  navigation-current:
    textColor: "{colors.blue}"
  session-row:
    textColor: "{colors.ink}"
    padding: "18px 12px"
  session-row-selected:
    backgroundColor: "{colors.soft-blue}"
  analysis:
    backgroundColor: "{colors.analysis}"
    padding: "28px"
---

# Design System: Smart Email Guardian

## Overview

**Creative North Star: "Cobalt actions and cool white surfaces"**

This existing scanner uses cobalt actions, cool white surfaces and a quiet blue analysis region. Its interface is a compact working tool for a school demonstration: the input, primary action and model output remain easy to locate.

A system sans-serif stack gives headings, controls and numerical results one consistent voice. Thin boundaries and restrained shadows distinguish interactive areas; outline SVG icons support labels without replacing them.

**Key Characteristics:**
- Cobalt primary actions with cool neutral boundaries.
- System sans-serif hierarchy and tabular numerical scores.
- Editor and analysis share one responsive workspace.
- Semantic result colors are accompanied by text and icons.

## Colors

The palette is a cool neutral foundation with a concentrated cobalt action color. Frontmatter values are normative; the names below describe their use.

### Primary

- **Cobalt** (`blue`) identifies the scan action, current navigation, links and the brand mark. **Deep cobalt** (`blue-dark`) strengthens hover and selected-control text.
- **Soft cobalt wash** (`soft-blue`) distinguishes selected examples and session rows. **Pressed blue** (`pressed`) supplies immediate press feedback.

### Neutral

- **Ink** (`ink`) carries primary text; **muted slate** (`muted`) carries supporting text and the editor placeholder.
- **White** (`white`) forms the header, workspace and example controls. **Cool page** (`page`) separates the workspace from the page; **analysis blue** (`analysis`) groups the model output.
- **Fine boundary** (`line`) divides structure. **Editor boundary** (`editor-border`) makes the input easier to find. **Focus blue** (`focus`) marks keyboard focus.
- **Analysis slate** (`analysis-copy`) and **analysis navy** (`analysis-heading`) preserve hierarchy on the blue panel. **Score track** and **score fill** distinguish the numerical meter from its track.

### Result semantics

- **Safe green** (`safe`) and **risk red** (`risk`) accompany explicit result labels and icons. Their tinted surfaces back the circular verdict icon. Risk meters use `risk-fill`.
- **Disabled blue** (`button-disabled`) marks the unavailable submit control while a scan is in progress.

**The Action Color Rule.** Use cobalt for primary actions, current navigation and focus-related emphasis; reserve green and red for result and error semantics.

**The Readable State Rule.** Keep placeholder text at the muted text color and communicate errors, selection and results with more than color alone.

## Typography

**Display Font:** System sans-serif, using the frontmatter stack.
**Body Font:** The same system sans-serif stack.

The type is direct and compact. Weight, size and tracking establish hierarchy without introducing a separate decorative face.

### Hierarchy

- **Display:** Page title; uses `display` and reduces to (1.625rem) below the mobile breakpoint.
- **Headline:** Awaiting-analysis message; uses `headline` and reduces to (1.375rem) on mobile. Completed-result headings use (1.5rem).
- **Title:** Composer and section headings use `title`; the session heading uses (1.125rem).
- **Body:** General body and editor use `body`. The editor increases line height to (1.75) for pasted text; supporting copy commonly uses (.875rem).
- **Label:** Field and example labels use `label`. Primary buttons use (.875rem), while metadata uses `metadata`. Model status text uses (.6875rem).
- Counts, scores and class probabilities use tabular numerals. Supporting analysis copy is limited to (34ch) on desktop and (55ch) on mobile; explanatory content reaches (70ch).

**The One Type Family Rule.** Use the system sans-serif stack throughout this operating interface, with weight and size establishing hierarchy.

## Layout

The header, main content and footer share a centered maximum width (1248px). Desktop horizontal gutters are (32px), with (36px) above the page heading. The main workspace pairs editor and analysis in proportional columns (1.15fr / .85fr); both permit shrinking with `minmax(0, ...)`.

At (1050px) and below, workspace proportions become (1.08fr / .92fr), panel padding becomes (26px), and the school-project note and keyboard hint are hidden. At (760px) and below, gutters become (20px), the header becomes (72px) tall, and the workspace stacks editor before analysis. The analysis divider moves to the top, its corner treatment moves to the bottom, and the empty-state heading flows without the desktop forced line break. Session rows become stacked label groups with a trailing arrow.

At (400px) and below, main gutters become (12px), panels use (22px 18px), sample controls tighten and hide their icons, and the primary action expands to fill available space. The recurring spacing rhythm is captured in frontmatter; component exceptions remain specific to their purpose.

## Elevation & Depth

Thin borders and white-to-blue tonal layering supply most depth. The workspace has one diffuse ambient shadow (`0 12px 36px -24px #213e7b3d`). The focused editor uses a small glow (`0 3px 12px -6px #244dcc55`); the hovered primary button gains a restrained shadow (`0 5px 12px -6px #244dcc80`). These are supporting cues rather than heavy raised surfaces.

## Shapes

The workspace is softly rounded; the analysis region follows the shared exterior corners and leaves the internal divider straight. Fields are slightly tighter than the workspace, while buttons and sample controls are tighter again. Borders are generally (1px). Circular shapes are limited to verdict and empty-state icon badges. Small keyboard keys use the `key` radius.

All icons are authored inline SVG, with a shared (24px) viewBox, rounded caps and joins, and (1.7) stroke width by default. Actual icon size follows context, commonly (14–20px); the large empty and loading mail icons use a lighter stroke. No raster imagery is part of this interface.

## Components

### Buttons

Primary scan buttons use cobalt fill, white text, a (48px) minimum height and the frontmatter padding. Hover darkens the fill and shifts the arrow by (3px); press darkens further and removes the shadow. During scanning, the disabled button displays “Scanning…” and a separate outlined cancel button appears. Secondary cancel controls have a (44px) minimum height. Text actions use cobalt text, a transparent underline at rest and a visible underline on hover.

Button color transitions take (160ms); arrow feedback takes (180ms) with the shared ease curve. Keyboard focus uses a (3px) outline with (4px) offset. Disabled controls use their implemented muted treatment and a not-allowed cursor.

### Chips

Synthetic example controls are real buttons with visible labels and outline icons, not result labels. Their selected state uses a pale blue fill, stronger blue border and `aria-pressed`. Hover changes boundary, text and background; press uses the pressed fill. They wrap with (8px) gaps, reduced to (6px) at the smallest breakpoint. Choosing a sample fills and focuses the editor; typing clears selection. They are disabled while scanning.

### Cards / Containers

The shared workspace contains one white editor region and one pale blue analysis region. Desktop composer padding is (32px), analysis padding is (28px). The component has a single exterior border and ambient shadow. Avoid turning each model row into an additional raised card: rows use quiet top dividers and vertical spacing (18px).

### Inputs / Fields

The labeled editor has a (1px) boundary and `editor` radius. The resizable textarea has a (220px) minimum height and padding (8px 16px 16px). Its placeholder uses the muted text token. Focus within changes the outer boundary and adds the small glow; the textarea also keeps a (2px) inset keyboard outline. An invalid submission adds a red boundary and an explicit error message. The character count sits below the text and uses tabular numerals. Clear text returns focus to the field.

### Navigation

The white brand bar uses muted navigation text with cobalt hover and current states. The current Scanner link has a cobalt underline (2px); This session gains a small pale blue count badge after scans. On mobile, the main links remain visible and the auxiliary How it works header link hides. A focus-revealed skip link reaches the scanner.

### Analysis and scores

The analysis panel has awaiting, loading and completed states. Loading shows a moving scan line and pulsing rows with descriptive text, without fabricated percentage progress. Completed output arrives through an opacity transition (220ms), reports the two model labels and exposes real numerical scores through native meters. Each model has a native disclosure for both class scores. Result labels combine text, color and an outline icon; the model caveat stays visible.

The shared ease curve is `cubic-bezier(.16, 1, .3, 1)`. Reduced motion stops scan sweeping and row pulsing, removes spatial arrow and disclosure transitions, and shortens result arrival to (80ms).

### Session rows and disclosures

Session result buttons are flat rows with separators, a scan number, two model labels and an arrow. Hover and selected states use pale blue; press uses the pressed fill. Selecting a row restores its result and focuses the analysis heading. Clear results removes the current-tab list. Native disclosures expose model score detail and the project explanation; the latter rotates its chevron on open.

## Do's and Don'ts

### Do:
- Do use the cobalt action palette and cool white or pale blue surfaces.
- Do retain visible keyboard focus, descriptive labels and text alongside result colors.
- Do stack the editor before analysis on narrow screens and allow labels to wrap.
- Do use the authored outline SVG icon family consistently.
- Do retain the model caveat and clearly label synthetic examples.

### Don't:
- Don't use semantic green or red as an unrelated decorative accent.
- Don't present loading as a numerical percentage or imply model certainty.
- Don't introduce unsupported school branding, benchmarks or testimonials.
- Don't make mobile heading line breaks depend on the desktop composition.
