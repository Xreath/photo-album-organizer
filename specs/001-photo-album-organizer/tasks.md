# Tasks: Photo Album Organizer

**Feature Branch**: `001-photo-album-organizer`  
**Input**: Design documents from `/specs/001-photo-album-organizer/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize React + Vite project with all dependencies and configuration

- [x] T001 Initialize Vite project with React and TypeScript template in project root
- [x] T002 Install core dependencies: react, react-dom, react-router-dom, @supabase/supabase-js in package.json
- [x] T003 [P] Install UI dependencies: tailwindcss, postcss, autoprefixer in package.json
- [x] T004 [P] Install drag-and-drop dependency: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities in package.json
- [x] T005 [P] Install utility dependencies: browser-image-compression, fractional-indexing in package.json
- [x] T006 [P] Install dev dependencies: vitest, @testing-library/react, playwright in package.json
- [x] T007 Configure Tailwind CSS with tailwind.config.js and postcss.config.js
- [x] T008 [P] Configure TypeScript with strict mode in tsconfig.json
- [x] T009 [P] Configure Vitest in vite.config.ts
- [x] T010 [P] Create environment variables file .env.local with Supabase placeholders
- [x] T011 Create project directory structure per plan.md (src/components, src/hooks, src/services, src/lib, src/types, src/pages)
- [x] T012 [P] Create base Tailwind styles in src/index.css

**Checkpoint**: Project scaffolding complete. Run `npm run dev` to verify Vite serves the app.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Initialize Supabase client in src/lib/supabase.ts with environment variables
- [x] T014 [P] Create TypeScript database types in src/types/database.ts (Album, Photo interfaces)
- [x] T015 [P] Create validation utility functions in src/lib/validation.ts (album name, file type, file size)
- [x] T016 Create fractional indexing utility in src/services/orderingService.ts (generatePosition, getPositionBetween)
- [x] T017 [P] Create image compression utility in src/lib/imageUtils.ts (compressImage, getImageDimensions)
- [x] T018 [P] Create shared UI components: Button in src/components/ui/Button.tsx
- [x] T019 [P] Create shared UI components: Modal in src/components/ui/Modal.tsx
- [x] T020 [P] Create shared UI components: Toast/notification in src/components/ui/Toast.tsx
- [x] T021 [P] Create shared UI components: LoadingSpinner in src/components/ui/LoadingSpinner.tsx
- [x] T022 [P] Create shared UI components: ConfirmDialog in src/components/ui/ConfirmDialog.tsx
- [x] T023 [P] Create shared UI components: EmptyState in src/components/ui/EmptyState.tsx
- [x] T024 Create app layout shell in src/components/layout/AppLayout.tsx with header and main content area
- [x] T025 [P] Create error boundary component in src/components/layout/ErrorBoundary.tsx
- [x] T026 Set up React Router in src/App.tsx with route placeholders for HomePage, AlbumPage, LoginPage, SignupPage
- [x] T027 Create Supabase database migration in supabase/migrations/001_initial_schema.sql with albums and photos tables
- [x] T028 [P] Add RLS policies for albums table in supabase/migrations/001_initial_schema.sql
- [x] T029 [P] Add RLS policies for photos table in supabase/migrations/001_initial_schema.sql
- [x] T030 [P] Create Supabase storage bucket configuration in supabase/migrations/002_storage.sql
- [x] T031 [P] Create seed data file in supabase/seed.sql for local development

**Checkpoint**: Foundation ready. Supabase migrations can be applied with `supabase db reset`. All shared components available.

---

## Phase 3: User Story 1 - Create and Manage Albums (Priority: P1) 🎯 MVP

**Goal**: Users can create, rename, and delete photo albums. Albums display grouped by creation date.

**Independent Test**: Create a new album, verify it appears on main page grouped by date. Rename and delete the album.

### Implementation for User Story 1

- [x] T032 [P] [US1] Create Album type and CRUD operations in src/services/albumService.ts
- [x] T033 [P] [US1] Create useAlbums hook in src/hooks/useAlbums.ts with list, create, update, delete functions
- [x] T034 [US1] Create AlbumCard component in src/components/albums/AlbumCard.tsx with name, date, and action buttons
- [x] T035 [P] [US1] Create CreateAlbumModal component in src/components/albums/CreateAlbumModal.tsx with name input and validation
- [x] T036 [P] [US1] Create EditAlbumModal component in src/components/albums/EditAlbumModal.tsx for renaming
- [x] T037 [US1] Create AlbumList component in src/components/albums/AlbumList.tsx with date grouping logic
- [x] T038 [US1] Create HomePage in src/pages/HomePage.tsx with AlbumList, create button, and loading/empty states
- [x] T039 [US1] Add delete album functionality with confirmation dialog in AlbumCard.tsx
- [x] T040 [US1] Add loading and error states to all album operations in useAlbums.ts
- [x] T041 [US1] Add toast notifications for album create/update/delete success and failure

**Checkpoint**: User Story 1 complete. Users can create, view, rename, and delete albums. Test by creating multiple albums on different dates.

---

## Phase 4: User Story 2 - Upload and View Photos in Albums (Priority: P2)

**Goal**: Users can upload photos to albums, view them in a tile grid, and open full-size view.

**Independent Test**: Upload single and multiple photos to an album. Verify thumbnails display in grid. Click to view full size.

### Implementation for User Story 2

- [x] T042 [P] [US2] Create Photo type and CRUD operations in src/services/photoService.ts with upload, list, delete
- [x] T043 [P] [US2] Create usePhotos hook in src/hooks/usePhotos.ts with list, upload, delete functions
- [x] T044 [US2] Create PhotoTile component in src/components/photos/PhotoCard.tsx with thumbnail and loading placeholder
- [x] T045 [US2] Create PhotoGrid component in src/components/photos/PhotoGrid.tsx with responsive tile layout
- [x] T046 [P] [US2] Create PhotoUploader component in src/components/photos/PhotoUploader.tsx with file input and drag-drop zone
- [x] T047 [US2] Create PhotoViewer component in src/components/photos/PhotoViewer.tsx for full-size view with close button
- [x] T048 [US2] Add multi-file upload support with progress tracking in PhotoUploader.tsx
- [x] T049 [US2] Add client-side image compression before upload using imageUtils.ts
- [x] T050 [US2] Create AlbumPage in src/pages/AlbumPage.tsx with PhotoGrid, PhotoUploader, and nav back to home
- [x] T051 [US2] Add file type validation and error messaging for invalid uploads
- [x] T052 [US2] Add file size validation (20MB limit) with error messaging
- [x] T053 [US2] Add delete photo functionality with confirmation dialog
- [x] T054 [US2] Add loading states and progress indicators for photo uploads
- [x] T055 [US2] Add empty state for albums with no photos prompting upload

**Checkpoint**: User Story 2 complete. Users can upload, view, and delete photos. Test by uploading various image types and sizes.

---

## Phase 5: User Story 3 - Reorder Albums via Drag and Drop (Priority: P3)

**Goal**: Users can drag albums to reorder them. Order persists after refresh. Date grouping replaced by custom order.

**Independent Test**: Drag an album to new position. Refresh page. Verify order persists and date groups are gone.

### Implementation for User Story 3

- [x] T056 [P] [US3] Add reorder function to albumService.ts using fractional indexing
- [x] T057 [P] [US3] Add updatePosition function to useAlbums.ts hook
- [x] T058 [US3] Create DraggableAlbumList component in src/components/albums/DraggableAlbumList.tsx using @dnd-kit/sortable
- [x] T059 [US3] Create DraggableAlbumCard component in src/components/albums/DraggableAlbumCard.tsx with drag handle
- [x] T060 [US3] Add drag overlay and drop indicators styling in DraggableAlbumList.tsx
- [x] T061 [US3] Implement has_custom_order flag logic: switch from date grouping to position ordering after first drag
- [x] T062 [US3] Add optimistic UI update for drag operations with rollback on error
- [x] T063 [US3] Update HomePage.tsx to use DraggableAlbumList instead of AlbumList after first reorder
- [x] T064 [US3] Add visual feedback during drag (opacity, scale, shadow effects)
- [x] T065 [US3] Handle drop outside valid zones by returning to original position

**Checkpoint**: User Story 3 complete. Albums can be reordered via drag-and-drop. Test by reordering multiple times and refreshing.

---

## Phase 6: User Story 4 - Reorder Photos Within an Album (Priority: P4)

**Goal**: Users can drag photos within an album to reorder them. Order persists after refresh.

**Independent Test**: Drag a photo to new position in grid. Refresh page. Verify order persists.

### Implementation for User Story 4

- [x] T066 [P] [US4] Add reorder function to photoService.ts using fractional indexing
- [x] T067 [P] [US4] Add updatePosition function to usePhotos.ts hook
- [x] T068 [US4] Create DraggablePhotoGrid component in src/components/photos/DraggablePhotoGrid.tsx using @dnd-kit/sortable
- [x] T069 [US4] Create DraggablePhotoCard component in src/components/photos/DraggablePhotoCard.tsx with drag capability
- [x] T070 [US4] Add drag overlay and drop indicators styling for photo grid
- [x] T071 [US4] Add optimistic UI update for photo drag operations with rollback on error
- [x] T072 [US4] Update AlbumPage.tsx to use DraggablePhotoGrid
- [x] T073 [US4] Add visual feedback during photo drag (opacity, scale, shadow effects)

**Checkpoint**: User Story 4 complete. Photos can be reordered within albums. Test by reordering photos and navigating away/back.

---

## Phase 7: User Story 5 - User Authentication (Priority: P5)

**Goal**: Users can sign up, log in, log out. Each user's data is private and isolated.

**Independent Test**: Sign up new account. Log out. Log in again. Create albums. Log in as different user and verify albums are isolated.

### Implementation for User Story 5

- [ ] T074 [P] [US5] Create useAuth hook in src/hooks/useAuth.ts with user state, signUp, signIn, signOut functions
- [ ] T075 [P] [US5] Create LoginPage in src/pages/LoginPage.tsx with email/password form and validation
- [ ] T076 [P] [US5] Create SignupPage in src/pages/SignupPage.tsx with email/password form and validation
- [ ] T077 [US5] Create AuthGuard component in src/components/auth/AuthGuard.tsx for protected routes
- [ ] T078 [US5] Update App.tsx to wrap protected routes (HomePage, AlbumPage) with AuthGuard
- [ ] T079 [US5] Add user_id to album creation in albumService.ts from current authenticated user
- [ ] T080 [US5] Add logout button to AppLayout.tsx header when user is authenticated
- [ ] T081 [US5] Add redirect to login page after logout
- [ ] T082 [US5] Handle auth errors with user-friendly messages (invalid credentials, user exists, etc.)
- [ ] T083 [US5] Add loading states during auth operations
- [ ] T084 [US5] Add session persistence using Supabase auth listener in useAuth.ts

**Checkpoint**: User Story 5 complete. Full auth flow works. RLS ensures data isolation between users.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [ ] T085 [P] Add responsive design breakpoints to AlbumList and PhotoGrid for mobile/tablet
- [ ] T086 [P] Add keyboard navigation support for drag-and-drop (a11y)
- [ ] T087 [P] Add ARIA labels to interactive elements (a11y)
- [ ] T088 Add global error handling for network failures with retry options
- [ ] T089 [P] Add page title updates using document.title or react-helmet
- [ ] T090 Add loading skeleton placeholders for albums and photos while fetching
- [ ] T091 [P] Review and improve all error messages for user clarity
- [ ] T092 Run Lighthouse audit and address critical performance issues
- [ ] T093 [P] Update README.md with project overview, setup instructions, and screenshots
- [ ] T094 Run quickstart.md validation: verify all commands work on fresh clone

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS ALL USER STORIES)
    ↓
┌─────────────────────────────────────────────────────────────┐
│  User Stories (can proceed in priority order or parallel)   │
│  P1 → P2 → P3 → P4 → P5                                     │
│                                                             │
│  US1 (Albums)     → Foundational                            │
│  US2 (Photos)     → US1 (needs albums to exist)             │
│  US3 (Album DnD)  → US1 (needs albums to reorder)           │
│  US4 (Photo DnD)  → US2 (needs photos to reorder)           │
│  US5 (Auth)       → Foundational (can be done in parallel)  │
└─────────────────────────────────────────────────────────────┘
    ↓
Phase 8: Polish (after desired user stories complete)
```

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|------------|---------------------|
| US1 (Albums) | Phase 2 only | US5 |
| US2 (Photos) | US1 | - |
| US3 (Album DnD) | US1 | US2, US4, US5 |
| US4 (Photo DnD) | US2 | - |
| US5 (Auth) | Phase 2 only | US1, US3 |

### Recommended Execution Order (Solo Developer)

1. Phase 1: Setup (T001-T012)
2. Phase 2: Foundational (T013-T031)
3. Phase 3: US1 - Albums (T032-T041) → **MVP Milestone**
4. Phase 4: US2 - Photos (T042-T055)
5. Phase 5: US3 - Album DnD (T056-T065)
6. Phase 6: US4 - Photo DnD (T066-T073)
7. Phase 7: US5 - Auth (T074-T084)
8. Phase 8: Polish (T085-T094)

---

## Parallel Execution Examples

### Phase 1: Setup (6 parallel opportunities)

```text
Sequential: T001 → T002
Parallel Group 1: T003, T004, T005, T006
Sequential: T007
Parallel Group 2: T008, T009, T010
Sequential: T011
Parallel Group 3: T012
```

### Phase 2: Foundational (high parallelism)

```text
Sequential: T013
Parallel Group 1: T014, T015, T017, T018, T019, T020, T021, T022, T023, T025
Sequential: T016, T024
Sequential: T026
Parallel Group 2: T027, T028, T029, T030, T031
```

### User Story 1: Albums

```text
Parallel Group 1: T032, T033
Sequential: T034
Parallel Group 2: T035, T036
Sequential: T037 → T038 → T039 → T040 → T041
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 - Albums
4. **STOP and VALIDATE**: Test album CRUD independently
5. Demo/deploy MVP (albums without photos or auth)

### Incremental Delivery

| Milestone | Stories | Value Delivered |
|-----------|---------|-----------------|
| MVP | US1 | Create and manage albums |
| v0.2 | US1 + US2 | Upload and view photos |
| v0.3 | US1 + US2 + US3 | Reorder albums |
| v0.4 | US1 + US2 + US3 + US4 | Reorder photos |
| v1.0 | All stories + Polish | Full production-ready app |

### Auth Integration Options

**Option A**: Build auth (US5) last, use hardcoded user_id during development  
**Option B**: Build auth (US5) first in parallel with US1, integrate early

Recommended: **Option A** for faster iteration on core features.

---

## Notes

- All tasks include exact file paths for immediate execution
- [P] tasks can run in parallel (different files, no dependencies)
- [Story] labels map tasks to user stories for traceability
- Each user story phase ends with a checkpoint for independent validation
- Commit after each task or logical group
- Run `npm run dev` frequently to catch build errors early
