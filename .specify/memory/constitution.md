<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 2.0.0
Modified Principles: Complete rewrite - simplified to development principles only
Added Sections: None (consolidated)
Removed Sections:
  - Purpose & Product Constraints (domain-specific, removed)
  - Engineering Values (consolidated into Code Quality)
  - Architecture & Boundaries (consolidated into Code Quality)
  - Data, Auth & Security (domain-specific, removed)
  - UX Consistency Rules (consolidated into User Experience Consistency)
  - Drag & Drop Behavior (domain-specific, removed)
  - Performance Expectations (renamed to Performance Requirements)
  - Testing Standards (retained, refined)
  - PR & CI Discipline (removed, CI requirements moved to Testing Standards)
  - Definition of Done (removed)

Templates Status:
  ✅ plan-template.md - Reviewed, Constitution Check section remains flexible
  ✅ spec-template.md - Reviewed, no changes needed
  ✅ tasks-template.md - Reviewed, testing standards still aligned
  
Follow-up TODOs: None

Rationale: Simplified constitution to focus exclusively on development principles that apply 
across all projects, removing product-specific and domain-specific rules.
-->

# Project Constitution

## Code Quality

- Write clear, readable, and maintainable code; avoid clever but opaque solutions.
- Use strong typing wherever possible; do not introduce loosely typed logic without clear justification.
- Maintain a clear separation of concerns between UI, business logic, and data access.
- Centralize access to external services (databases, APIs, etc.) behind well-defined interfaces.

**Rationale**: Clear code reduces cognitive load, strong typing catches errors early, separation of concerns enables independent testing and modification, and centralized service access simplifies maintenance and testing.

## Testing Standards

- Follow the testing pyramid:
  - Unit tests for core logic
  - Integration tests for data access and external services
  - Minimal end-to-end (E2E) tests for critical user flows
- All new features and bug fixes MUST include appropriate tests.
- All tests MUST run in CI and pass before code is merged.

**Rationale**: The testing pyramid balances thorough coverage with execution speed. Unit tests provide fast feedback on logic errors, integration tests verify assumptions about external dependencies, and E2E tests ensure critical paths work. CI enforcement prevents regressions from reaching production.

## User Experience Consistency

- Ensure consistent UI patterns and interaction behavior across the application.
- Always provide clear loading, success, and error states for user actions.
- User-facing error messages MUST be understandable and actionable.

**Rationale**: Consistency builds user trust and reduces cognitive load. Clear state feedback reduces user anxiety during operations. Actionable error messages empower users to self-recover without frustration or support intervention.

## Performance Requirements

- Develop with performance in mind; avoid unnecessary re-renders, unbounded queries, and large payloads.
- Use lazy loading, pagination, or virtualization where appropriate.
- Address performance regressions before shipping new features.

**Rationale**: Performance directly impacts user experience and retention. Proactive performance consideration during development is cheaper than reactive optimization. Performance regressions signal architectural problems that compound over time.

## Governance

This constitution defines development standards that apply to all features and changes.

Amendments require:
- Documented rationale for the proposed change
- Review and explicit approval
- Version increment following semantic versioning

All changes MUST be reviewed against these principles before merging.

Deviations from these principles MUST be explicitly justified and documented in the relevant design artifacts (e.g., implementation plan).

**Version**: 2.0.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-02
