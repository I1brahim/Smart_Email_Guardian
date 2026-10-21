# Smart Email Guardian

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

A school project demonstrating spam and phishing classification of pasted email
text. The user confirmed this is a school project; enterprise workflows are out
of scope. The interface should be interactive, responsive and visually engaging.

## Capabilities and Constraints

Preserve the existing Flask scan API, validation and canonical classification
contract. Never restore shared server history or persist email contents. Results
may be kept in the current tab's React memory only. Existing data, main and
production deployments must not be changed without explicit approval.

## Evidence on Hand

The working code has two checked-in classification models and a stateless scan
endpoint. Sample messages are synthetic teaching material, not accuracy claims.
Model predictions can be wrong and require a visible caveat.

## Open Decisions

The grading rubric, school identity and exact presentation audience were not
provided. Do not invent school branding, authorship, benchmarks or testimonials.
