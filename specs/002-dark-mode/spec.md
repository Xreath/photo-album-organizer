# Dark Mode / Light Mode Feature

## Overview
Add a theme toggle feature that allows users to switch between light and dark modes. The preference should persist across sessions and respect system preferences by default.

## User Stories

### US-001: Toggle Theme
**As a** user  
**I want to** toggle between light and dark mode  
**So that** I can use the app comfortably in different lighting conditions

**Acceptance Criteria:**
- Toggle button visible in the header
- Smooth transition between themes
- All components properly styled for both themes

### US-002: Persist Theme Preference
**As a** user  
**I want to** have my theme preference remembered  
**So that** I don't have to set it every time

**Acceptance Criteria:**
- Theme saved to localStorage
- Preference restored on page reload
- Works across browser sessions

### US-003: Respect System Preference
**As a** user  
**I want to** have the app respect my system theme preference  
**So that** it matches my OS settings by default

**Acceptance Criteria:**
- Detect system preference on first visit
- Apply matching theme automatically
- User can override with manual toggle

## Technical Requirements

### Theme Context
- Create ThemeContext with provider
- Manage theme state (light/dark)
- Toggle function
- localStorage persistence

### Tailwind Configuration
- Enable class-based dark mode
- Configure dark variants

### Component Updates
- Update all components with dark: variants
- AppLayout, Button, Input, Modal, etc.
- Album cards, photo grid, auth pages

### UI Toggle
- Sun/Moon icon toggle in header
- Smooth icon transition
- Accessible (aria-label)

## Out of Scope
- Multiple theme options (only light/dark)
- Per-page theme settings
- Theme scheduling (auto switch by time)

## Dependencies
- Tailwind CSS (existing)
- React Context API (existing)
