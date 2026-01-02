# Implementation Plan: Photo Album Organizer

**Branch**: `001-photo-album-organizer` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-photo-album-organizer/spec.md`

## Summary

Build a personal photo album organizer web application that allows users to create flat (non-nested) albums, upload and view photos in a tile/grid layout, and reorder both albums and photos via drag-and-drop with persistent ordering. The application uses React with Vite and Tailwind CSS for the frontend, with Supabase providing authentication, PostgreSQL database for metadata, and object storage for images. Client-side image resizing optimizes uploads before storage.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: React 18, Vite 5, Tailwind CSS 3, @supabase/supabase-js, @dnd-kit/core (drag-and-drop), browser-image-compression  
**Storage**: Supabase (PostgreSQL for metadata, Supabase Storage for images)  
**Testing**: Vitest (unit), Playwright (E2E), Supabase local dev for integration  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: Page load <3s, drag operations <1s persistence, thumbnail placeholders <500ms  
**Constraints**: 20MB max image upload, optimistic UI updates, responsive design  
**Scale/Scope**: Up to 100 albums per user, up to 500 photos per album

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate Criteria | Status |
|-----------|---------------|--------|
| **Code Quality** | Separation of concerns (UI, business logic, data access) | ✅ Plan separates: components, hooks/services, Supabase client |
| **Code Quality** | Strong typing | ✅ TypeScript strict mode enforced |
| **Code Quality** | Centralized external service access | ✅ Single Supabase client module |
| **Testing Standards** | Unit tests for core logic | ✅ Planned: ordering logic, validation |
| **Testing Standards** | Integration tests for data access | ✅ Planned: Supabase CRUD, RLS policies |
| **Testing Standards** | E2E tests for critical flows | ✅ Planned: auth, album CRUD, photo upload, reorder |
| **UX Consistency** | Loading, success, error states | ✅ FR-019, FR-020 require this |
| **UX Consistency** | Actionable error messages | ✅ FR-020 requires this |
| **Performance** | Lazy loading, pagination | ✅ Photo grid virtualization planned |
| **Performance** | Avoid unbounded queries | ✅ Pagination for albums/photos |

**Result**: All gates pass. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-photo-album-organizer/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Database schema
├── quickstart.md        # Phase 1: Developer setup guide
├── contracts/           # Phase 1: API contracts
│   └── api.md           # Supabase table schemas and RLS policies
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/          # React UI components
│   ├── albums/          # Album list, album card, create/edit modals
│   ├── photos/          # Photo grid, photo viewer, upload
│   ├── auth/            # Login, signup, auth guard
│   ├── layout/          # App shell, navigation, header
│   └── ui/              # Shared primitives (button, modal, toast, etc.)
├── hooks/               # Custom React hooks
│   ├── useAlbums.ts     # Album CRUD and ordering
│   ├── usePhotos.ts     # Photo CRUD and ordering
│   └── useAuth.ts       # Authentication state
├── services/            # Business logic (decoupled from UI)
│   ├── albumService.ts  # Album operations
│   ├── photoService.ts  # Photo operations, upload, resize
│   └── orderingService.ts # Drag-and-drop order calculation
├── lib/                 # Infrastructure
│   ├── supabase.ts      # Supabase client initialization
│   └── imageUtils.ts    # Client-side image resizing
├── types/               # TypeScript type definitions
│   └── database.ts      # Generated Supabase types
├── pages/               # Route components
│   ├── HomePage.tsx     # Main album list
│   ├── AlbumPage.tsx    # Single album view with photos
│   ├── LoginPage.tsx    # Authentication
│   └── SignupPage.tsx   # Registration
├── App.tsx              # Root component with routing
├── main.tsx             # Entry point
└── index.css            # Tailwind imports and global styles

tests/
├── unit/                # Vitest unit tests
│   ├── orderingService.test.ts
│   └── imageUtils.test.ts
├── integration/         # Supabase integration tests
│   ├── albums.test.ts
│   ├── photos.test.ts
│   └── rls.test.ts      # Row-Level Security tests
└── e2e/                 # Playwright E2E tests
    ├── auth.spec.ts
    ├── albums.spec.ts
    └── photos.spec.ts

supabase/
├── migrations/          # SQL migration files
│   └── 001_initial_schema.sql
├── seed.sql             # Development seed data
└── config.toml          # Local Supabase config
```

**Structure Decision**: Single SPA structure with Supabase as the backend. All UI in `src/`, with clear separation between components (presentation), hooks (state management), services (business logic), and lib (infrastructure). Supabase migrations stored in `supabase/` for version-controlled schema.

## Complexity Tracking

> No constitution violations detected. All gates pass without exceptions.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Drag-and-drop library | @dnd-kit/core | More flexible than react-beautiful-dnd, lighter than dnd-kit full suite |
| Image resizing | browser-image-compression | Client-side resize before upload reduces bandwidth; server thumbnails still used for display |
| State management | React hooks + Supabase realtime | No Redux/Zustand needed; Supabase handles sync |
