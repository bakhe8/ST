# Naming Conventions

## Purpose

Provide contributor-facing standards for naming, consistency, review gates, and documentation hygiene.

## Audience

- Maintainers
- Contributors
- Future project owners

## Scope

- In scope: requirements, design decisions, operational expectations
- Out of scope: implementation details that belong in source code comments

## Current Baseline

- Status: draft (rewritten from scratch)
- Last updated: 2026-02-17
- Owner: Documentation Standards Owner

## Roadmap Linkage

- This document contributes to the project roadmap by clarifying one stable area of responsibility.
- Any architectural, API, or data change must update this file in the same PR.

## Requirements

1. Keep statements testable and specific.
2. Separate mandatory rules from recommendations.
3. Record assumptions explicitly.

## Decisions

- Decision 1: Use a store-centric runtime model for documentation consistency.
- Decision 2: Prioritize maintainability over narrative verbosity.
- Decision 3: Keep docs modular and cross-referenced.

## Validation Checklist

- [ ] Terminology is consistent with README and ARCHITECTURE.
- [ ] No conflicting requirement with other docs.
- [ ] At least one actionable checklist exists.

## Change Process

1. Open change request with reason and expected impact.
2. Update this file and linked files together.
3. Record validation outcome before merge.

## Open Questions

- What is the next measurable milestone for this topic?
- What should be automated to reduce manual drift?

## Maintenance Policy

- Review cadence: biweekly
- Breaking changes: require explicit migration notes
