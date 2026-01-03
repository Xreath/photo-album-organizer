# 📸 Photo Album Organizer

A modern, full-stack photo album management application built with React, TypeScript, and Supabase. Organize your photos into albums with drag-and-drop reordering, full-size viewing, and secure cloud storage.

![Photo Album Organizer](/public/screenshot.png)

## ✨ Features

### Core Functionality
- 🗂️ **Album Management** - Create, rename, and delete photo albums
- 📤 **Photo Upload** - Drag-and-drop multi-file upload with progress tracking
- 🖼️ **Full-Size Viewer** - Lightbox with keyboard navigation (arrow keys, ESC)
- 🗑️ **Delete with Confirmation** - Safe deletion for both albums and photos

### Advanced Features
- 🎯 **Drag-and-Drop Reordering** - Reorder albums and photos with smooth animations
- 💾 **Persistent Order** - Custom order saved to database using fractional indexing
- 🔄 **Optimistic Updates** - Instant UI feedback with error rollback
- 📦 **Automatic Compression** - Client-side image optimization before upload
- 🌓 **Date Grouping** - Albums grouped by creation date (until custom order)

### Technical Features
- 🔐 **User Authentication** - Email/password sign up and login
- 🔒 **Row-Level Security** - Private data isolation per user
- ⚡ **Real-time Updates** - Optimistic UI with database sync
- 🎨 **Modern UI** - Tailwind CSS with smooth transitions
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 📱 **Responsive Design** - Mobile, tablet, and desktop support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([sign up free](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/Xreath/photo-album-organizer.git
cd photo-album-organizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait ~2 minutes for provisioning

#### Run Database Migrations

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New query**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to create tables and Row-Level Security (RLS) policies
5. Create another query with `supabase/migrations/002_storage.sql`
6. Click **Run** to set up the storage bucket

#### Create Storage Bucket

1. Go to **Storage** in the Supabase sidebar
2. Click **New bucket**
3. Name: `photos`
4. Make it **public** (for image serving)
5. Click **Create bucket**

#### Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

### 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Disable Email Confirmation (Development)

For faster testing:

1. Go to Supabase **Authentication** → **Providers** → **Email**
2. **Disable** "Confirm email" toggle
3. Click **Save**

Now you can sign up and log in instantly!

## 📁 Project Structure

```
photo-album-organizer/
├── src/
│   ├── components/
│   │   ├── albums/          # Album-related components
│   │   │   ├── AlbumCard.tsx
│   │   │   ├── DraggableAlbumCard.tsx
│   │   │   ├── AlbumList.tsx
│   │   │   ├── DraggableAlbumList.tsx
│   │   │   ├── CreateAlbumModal.tsx
│   │   │   └── EditAlbumModal.tsx
│   │   ├── photos/          # Photo-related components
│   │   │   ├── PhotoCard.tsx
│   │   │   ├── DraggablePhotoCard.tsx
│   │   │   ├── PhotoGrid.tsx
│   │   │   ├── DraggablePhotoGrid.tsx
│   │   │   ├── PhotoUploader.tsx
│   │   │   └── PhotoViewer.tsx
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── EmptyState.tsx
│   │   └── layout/          # Layout components
│   │       ├── AppLayout.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAlbums.ts
│   │   ├── usePhotos.ts
│   │   └── useAuth.ts
│   ├── services/            # API and business logic
│   │   ├── albumService.ts
│   │   ├── photoService.ts
│   │   └── orderingService.ts
│   ├── lib/                 # Utility functions
│   │   ├── supabase.ts
│   │   ├── validation.ts
│   │   └── imageUtils.ts
│   ├── types/               # TypeScript types
│   │   └── database.ts
│   └── pages/               # Page components
│       ├── HomePage.tsx
│       ├── AlbumPage.tsx
│       ├── LoginPage.tsx
│       └── SignupPage.tsx
├── supabase/
│   └── migrations/          # Database migrations
│       ├── 001_initial_schema.sql
│       └── 002_storage.sql
└── specs/                   # Project documentation
    └── 001-photo-album-organizer/
        ├── spec.md
        ├── plan.md
        └── tasks.md
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **@dnd-kit** - Drag-and-drop interactions

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Row-Level Security (RLS)
  - Storage with public CDN
  - Authentication

### Key Libraries
- `browser-image-compression` - Client-side image optimization
- `fractional-indexing` - O(1) drag-and-drop reordering
- `@testing-library/react` - Unit testing
- `@playwright/test` - E2E testing

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test

# Run E2E tests
npm run test:e2e

# Type checking
npm run typecheck
```

## 📚 Development Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Run TypeScript checks
npm test           # Run tests
```

## 🎨 Key Features Explained

### Drag-and-Drop Reordering

Uses **fractional indexing** for O(1) reordering:
- No need to update all items when reordering
- Position is a string like `"a0"`, `"a1"`, `"a0V"` (between `"a0"` and `"a1"`)
- Instant UI updates with optimistic rendering
- Automatic rollback on errors

### Image Compression

Before upload:
- Max dimensions: 2048x2048px
- Max file size: 2MB
- Quality: 80%
- Format: JPEG for maximum compatibility

### Authentication & Security

- Email/password authentication via Supabase Auth
- Row-Level Security (RLS) ensures users only see their own data
- Secure storage with user-scoped folders

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- Icons from [Heroicons](https://heroicons.com)
- Drag-and-drop by [@dnd-kit](https://dndkit.com)

---

**Made with ❤️ using React, TypeScript, and Supabase**
