# Email Guardian

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

An interactive tool for exploring spam and phishing classification of pasted
email text. The interface should be responsive and visually engaging.

## Capabilities and Constraints

Preserve the existing Flask scan API, validation and canonical classification
contract. Never restore shared server history or persist email contents. Results
may be kept in the current tab's React memory only. Existing data, main and
production deployments must not be changed without explicit approval.

## Evidence on Hand

The working code has two checked-in classification models and a stateless scan
endpoint. Sample messages are synthetic examples, not accuracy claims.
Model predictions can be wrong and require a visible caveat.

## Open Decisions

The exact presentation audience was not provided. Do not invent authorship,
benchmarks or testimonials.

## Confirmed visual direction

The user requested the name Email Guardian, a new landing page, and the supplied
cyberpunk/glitch system across the entire frontend. Dark mode is mandatory, with
green, magenta and cyan neon, chamfered shapes, terminal typography and subtle
CRT textures. Preserve accessible reading contrast and stoppable motion.
