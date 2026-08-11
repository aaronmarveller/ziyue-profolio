# Apple-Inspired Research Portfolio Redesign

## Problem Statement

The public portfolio presents strong research content, but its current visual system is a generic, static collection of pages. It does not clearly express a calm, premium research identity, offer a cohesive journey from introduction to research and publications, or adapt its navigation and presentation carefully for small screens and accessibility preferences. Placeholder contact details and unavailable document links also risk undermining trust.

## Solution

Redesign the public research portfolio as a restrained, Apple-inspired editorial experience. The home page will introduce Ziyue's research focus and guide visitors through featured research, publications, and a collaboration invitation. Research, publications, and contact remain distinct destinations within a shared visual system. The experience will use platform typography, a light-first adaptive palette, restrained blue accents, material only where it establishes navigation hierarchy, and short purposeful feedback motion.

The redesign preserves the existing research content model, project and publication routes, contact API, and private administration experience. It will not invent work samples, imagery, biographical claims, contact information, or downloadable files.

## User Stories

1. As a prospective collaborator, I want to understand the researcher's focus immediately, so that I can decide whether the portfolio is relevant to my work.
2. As a prospective collaborator, I want a clear path from the introduction to featured research, so that I can evaluate the most relevant evidence first.
3. As a prospective collaborator, I want to discover publications alongside research projects, so that I can see the breadth of the research record.
4. As a prospective collaborator, I want direct access to research, publications, and contact from every public page, so that I can navigate predictably.
5. As a mobile visitor, I want a compact navigation control that opens an understandable menu, so that links are not crowded or difficult to tap.
6. As a keyboard user, I want to operate navigation, links, the menu, and the contact form with visible focus feedback, so that I can use the portfolio without a pointer.
7. As a visitor who prefers reduced motion, I want state changes that remain clear without sliding, bouncing, or large movement, so that the site is comfortable to use.
8. As a visitor who prefers reduced transparency or greater contrast, I want readable navigation and content surfaces, so that visual materials do not obscure information.
9. As a reader, I want comfortable long-form research and publication typography, so that I can read titles, abstracts, and case studies without visual fatigue.
10. As a visitor, I want project cards to communicate their interactive affordance immediately, so that I know how to reach the full case study.
11. As a visitor, I want active, hover, and pressed feedback to be subtle and immediate, so that the interface feels responsive without distracting from the research.
12. As a visitor, I want the site to use authentic research content rather than decorative stock visuals, so that the portfolio remains credible.
13. As a visitor, I want unavailable CV, PDF, and placeholder-email actions withheld, so that I am not sent to broken or misleading destinations.
14. As a portfolio owner, I want existing projects and publications to retain their current routes and source content, so that a visual redesign does not disrupt established links or content workflows.
15. As a portfolio owner, I want the contact form's sending, success, and failure states to remain intact, so that the redesign does not change its functional behavior.
16. As a portfolio owner, I want the private administration area and APIs left unchanged, so that public visual work does not create operational risk.
17. As a visitor using a light color scheme, I want a calm neutral interface with one clear blue accent, so that hierarchy is evident without a marketing-heavy visual style.
18. As a visitor using a dark color scheme, I want an equally legible adaptive presentation, so that the portfolio respects my device preference.
19. As a visitor arriving on a detailed research page, I want the page to feel like part of the same system as the home page, so that the experience retains context.
20. As a visitor, I want footer and navigation language to use the portfolio's research terminology, so that labels accurately describe the content they reveal.

## Implementation Decisions

- Treat the public portfolio as a research-led collaboration portfolio. Use “Research,” “Publications,” and “Contact” as the public navigation vocabulary; express biography as a concise collaboration invitation rather than adding an unsupported standalone destination.
- Apply one shared public visual system across the home page, research listing and detail views, publications, contact, footer, and responsive navigation. Preserve the private administration area, server routes, markdown content contracts, and existing public route structure.
- Compose the home page as an editorial sequence: introduction, featured research, selected publications, then collaboration/contact invitation. Keep research and publication destinations available for deeper reading.
- Use the platform system sans-serif stack instead of a branded web font. Establish hierarchy with size-specific tracking, leading, weight, and fluid responsive type sizing.
- Use a neutral, light-first palette with one restrained blue accent. Support an adaptive dark presentation from the same tokenized system rather than maintaining a separate visual language.
- Make floating navigation and the small-screen menu the only translucent materials. Content cards, reading surfaces, form controls, and publication entries remain opaque and high contrast.
- Provide immediate press feedback and subtle hover/focus elevation or color change for interactive elements. Use short opacity-based state transitions by default; do not introduce parallax, autoplaying animation, looping effects, or broad scroll-driven movement.
- Implement the small-screen menu as an accessible, keyboard-operable disclosure or dialog-like panel with clear open and closed states, focus management appropriate to its interaction model, and a path that mirrors its entry and exit.
- Honor reduced motion by replacing spatial transitions with short opacity changes or static state updates. Honor reduced transparency and increased contrast by solidifying materials and strengthening contrast boundaries.
- Keep the site imagery-free until authentic research visuals are available. Do not add stock imagery, AI-generated visuals, fabricated outcomes, or unsupported content claims.
- Derive contact and download action visibility from whether the supplied content is usable. Do not display the known placeholder email or unavailable local CV/PDF targets; preserve valid future content without requiring structural changes.
- Preserve the existing contact request and its observable sending, success, and failure behavior while restyling the form and validation/focus feedback.

## Testing Decisions

- Test external behavior rather than class names, style implementation, or component internals.
- Add page- and component-boundary coverage for the public portfolio: navigation labels and destinations, the responsive menu's open/close and keyboard behavior, the home page's research/publication/contact journey, project-card navigation, and conditional absence of unusable contact/download actions.
- Verify the existing content-access seams still render current research, publications, and contact information correctly; existing content-library tests are the prior art for preserving the markdown contract.
- Cover the contact form's observable idle, sending, success, and error states without changing its API contract.
- Exercise focus visibility and semantic controls in rendered tests, and validate reduced-motion, reduced-transparency, contrast, and color-scheme styling with focused browser or stylesheet assertions where the test environment supports those media features.
- Run the existing unit suite, linting, production build, and a responsive manual review of each public route. The manual review must include keyboard navigation and a small-screen menu check.

## Out of Scope

- Changes to the private administration portal, authentication, content commit workflow, contact API, or markdown schema.
- New research content, fabricated case-study evidence, stock/AI-generated imagery, analytics, social features, or internationalisation.
- Restoring or creating the absent CV and publication PDF files, or replacing the placeholder email with unprovided personal contact information.
- Gesture-heavy interactions, drag physics, parallax, looping animation, or decorative motion.

## Further Notes

- This supersedes the earlier visual assumptions of an Inter-first, fixed light-only public presentation while preserving the project’s research terminology and content architecture.
- The highest practical verification seam is the rendered public-portfolio experience. It gives confidence across the shared layout and reusable content presentation without coupling tests to Tailwind implementation details.
