# Research: Photo Album Organizer

**Feature**: 001-photo-album-organizer  
**Date**: 2026-01-02  
**Phase**: 0 - Research & Technology Decisions

## Technology Stack Decisions

### 1. Frontend Framework: React + Vite

**Decision**: React 18 with Vite 5 as the build tool

**Rationale**:
- User specified React + Vite
- Vite provides fast HMR and optimized builds
- React 18 concurrent features support smooth drag-and-drop interactions
- Excellent TypeScript support

**Alternatives Considered**:
- Next.js: Overkill for SPA, SSR not needed for personal photo app
- Create React App: Deprecated, slower than Vite

### 2. Styling: Tailwind CSS 3

**Decision**: Tailwind CSS 3 with utility-first approach

**Rationale**:
- User specified Tailwind CSS
- Rapid UI development with consistent design tokens
- Easy responsive design with breakpoint prefixes
- Small production bundle with PurgeCSS

**Alternatives Considered**:
- CSS Modules: More boilerplate, less consistent
- Styled Components: Runtime overhead, not needed

### 3. Backend: Supabase

**Decision**: Supabase for authentication, PostgreSQL database, and file storage

**Rationale**:
- User specified Supabase
- Unified platform: auth, database, storage, realtime
- Row-Level Security (RLS) enforces data isolation at database level
- Supabase Storage handles image hosting with automatic CDN
- Generated TypeScript types from database schema

**Alternatives Considered**:
- Firebase: Less SQL flexibility, vendor-specific query language
- Custom backend: Significantly more development time

### 4. Drag-and-Drop: @dnd-kit/core

**Decision**: @dnd-kit/core for drag-and-drop functionality

**Rationale**:
- Modern, accessible, and performant
- Works well with React 18 concurrent mode
- Supports both sortable lists (albums, photos) and grid layouts
- Keyboard navigation built-in for accessibility
- Smaller bundle than alternatives when using only core

**Alternatives Considered**:
- react-beautiful-dnd: Deprecated, not maintained
- react-dnd: More complex API, heavier
- Framer Motion drag: Limited sortable functionality

### 5. Client-Side Image Resizing: browser-image-compression

**Decision**: browser-image-compression library for pre-upload optimization

**Rationale**:
- Reduces upload size and bandwidth usage
- Processes images in web workers (non-blocking)
- Configurable quality and max dimensions
- Handles EXIF orientation automatically

**Configuration**:
```javascript
{
  maxSizeMB: 2,           // Max file size after compression
  maxWidthOrHeight: 2048, // Max dimension (originals)
  useWebWorker: true,     // Non-blocking compression
  preserveExif: false     // Strip metadata for privacy
}
```

**Alternatives Considered**:
- Server-side only: Higher upload times, more bandwidth
- Canvas API directly: More code, less edge case handling

### 6. Server-Side Thumbnails: Supabase Image Transformations

**Decision**: Use Supabase Storage image transformations for thumbnails

**Rationale**:
- Built-in to Supabase Storage (no additional infrastructure)
- On-the-fly transformation via URL parameters
- Cached at edge for performance
- Supports resize, crop, format conversion

**Usage**:
```
// Original
https://project.supabase.co/storage/v1/object/public/photos/image.jpg

// 300x300 thumbnail
https://project.supabase.co/storage/v1/object/public/photos/image.jpg?width=300&height=300&resize=cover
```

**Alternatives Considered**:
- Supabase Edge Functions: More control but more complexity
- Pre-generated thumbnails on upload: Storage duplication, more upload time

### 7. Ordering Algorithm: Fractional Indexing

**Decision**: Use fractional indexing for album and photo ordering

**Rationale**:
- Avoids renumbering all items on reorder (O(1) updates)
- Works well with drag-and-drop (insert between any two items)
- Handles concurrent edits gracefully
- No gaps or collisions

**Implementation**:
- Store `position` as a string (e.g., "a0", "a1", "a0V")
- Use `fractional-indexing` npm package for generating keys
- New item position = midpoint between neighbors

**Alternatives Considered**:
- Integer positions: Requires renumbering on insert (O(n) worst case)
- Linked list: Complex queries for ordering
- Timestamps: Doesn't support manual ordering

### 8. Testing Strategy

**Decision**: Vitest for unit/integration, Playwright for E2E

**Rationale**:
- Vitest: Native Vite integration, fast, Jest-compatible API
- Playwright: Cross-browser E2E, better than Cypress for modern apps
- Supabase CLI provides local dev environment for integration tests

**Test Coverage Plan**:
| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Vitest | Ordering logic, image utils, validation |
| Integration | Vitest + Supabase local | CRUD operations, RLS policies |
| E2E | Playwright | Auth flow, album CRUD, photo upload, drag-and-drop |

### 9. State Management

**Decision**: React hooks + Supabase client (no external state library)

**Rationale**:
- App state is primarily server-state (albums, photos)
- Supabase JS client handles caching and realtime updates
- React Query patterns via custom hooks (`useAlbums`, `usePhotos`)
- No need for Redux/Zustand complexity

**Pattern**:
```typescript
// Custom hook wraps Supabase operations
function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch, create, update, delete, reorder methods
  return { albums, loading, error, createAlbum, deleteAlbum, reorderAlbums };
}
```

### 10. Authentication Flow

**Decision**: Supabase Auth with email/password

**Rationale**:
- User specified email/password for MVP
- Supabase Auth handles session management, tokens, refresh
- RLS policies use `auth.uid()` for data isolation
- Easy to add OAuth providers later

**Flow**:
1. User signs up → Supabase creates auth.users record
2. App creates albums/photos with `user_id = auth.uid()`
3. RLS policies filter all queries by `user_id`
4. Logout clears session; data inaccessible

## Resolved Clarifications

| Clarification | Resolution |
|---------------|------------|
| Thumbnail generation | Server-side via Supabase Image Transformations; client-side compression for upload optimization only |
| Album ordering vs date grouping | Custom order overrides date grouping entirely after first manual reorder |
| Deletion confirmation | Confirmation dialog required for all delete operations |

## Open Questions (Deferred to Implementation)

None. All critical decisions made.
