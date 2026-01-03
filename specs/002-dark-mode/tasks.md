# Dark Mode Implementation Tasks

## Phase 1: Infrastructure Setup

### T001: Configure Tailwind Dark Mode
- [x] Create tailwind.config.js
- [x] Enable class-based dark mode (`darkMode: 'class'`)
- [ ] Verify configuration works

### T002: Create Theme Context
- [x] Create ThemeContext.tsx
- [x] Add ThemeProvider component
- [x] Add useTheme hook
- [ ] Add localStorage persistence
- [ ] Add system preference detection

### T003: Integrate Theme Provider
- [ ] Wrap App with ThemeProvider
- [ ] Verify context accessible in components

---

## Phase 2: Core UI Components

### T004: Update AppLayout
- [ ] Add dark background (dark:bg-gray-900)
- [ ] Add dark text colors
- [ ] Update header styling

### T005: Add Theme Toggle Button
- [ ] Create ThemeToggle component
- [ ] Sun icon for light mode
- [ ] Moon icon for dark mode
- [ ] Add to header

### T006: Update Button Component
- [ ] Primary button dark styles
- [ ] Secondary button dark styles
- [ ] Ghost button dark styles
- [ ] Danger button dark styles

### T007: Update Input Component
- [ ] Dark background
- [ ] Dark border
- [ ] Dark focus ring
- [ ] Dark placeholder text

### T008: Update Modal Component
- [ ] Dark overlay
- [ ] Dark background
- [ ] Dark border
- [ ] Dark text

---

## Phase 3: Feature Components

### T009: Update Album Components
- [ ] AlbumCard dark styles
- [ ] DraggableAlbumCard dark styles
- [ ] AlbumList dark styles
- [ ] DraggableAlbumList dark styles

### T010: Update Photo Components
- [ ] PhotoCard dark styles
- [ ] DraggablePhotoCard dark styles
- [ ] PhotoGrid dark styles
- [ ] PhotoUploader dark styles
- [ ] PhotoViewer dark styles

### T011: Update Auth Pages
- [ ] LoginPage dark styles
- [ ] RegisterPage (if separate)
- [ ] Auth form styling

---

## Phase 4: Polish

### T012: Update Misc Components
- [ ] EmptyState dark styles
- [ ] LoadingSpinner dark styles
- [ ] ConfirmDialog dark styles
- [ ] Toast notifications dark styles

### T013: CSS Variables & Transitions
- [ ] Add smooth transition on theme change
- [ ] Prevent flash on page load

### T014: Testing & QA
- [ ] Test all pages in light mode
- [ ] Test all pages in dark mode
- [ ] Test persistence across sessions
- [ ] Test system preference detection

---

## Completion Checklist
- [ ] All components have dark variants
- [ ] Theme persists in localStorage
- [ ] System preference works on first visit
- [ ] Toggle button visible and working
- [ ] No flash of wrong theme on load
- [ ] Smooth transitions
