# Album Cover Photos - Setup Instructions

## ✅ What's Done

The backend is ready! I've added:

1. **Database migration** - `supabase/migrations/003_album_covers.sql`
2. **TypeScript types** - `cover_photo_id` added to Album interface
3. **Auto-cover** - First uploaded photo automatically becomes the album cover
4. **Service functions** - `setAlbumCover()`, `getAlbumsWithCovers()`

## 🚀 Setup (2 minutes)

### Step 1: Run Database Migration

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New query**
4. Copy and paste the contents of: `supabase/migrations/003_album_covers.sql`
5. Click **Run**

You should see: `Success. No rows returned`

### Step 2: Test It

1. Go to your app: http://localhost:5173
2. **Create a new album** (or open an existing empty one)
3. **Upload a photo**
4. **Go back to albums** - the first photo should automatically be the album cover!

## 🎨 What Happens Now

- ✅ First photo uploaded = automatic cover
- ✅ Covers persist in database
- ⏳ Album cards still show placeholder (UI update in progress)

## 📋 Remaining Work

To fully display covers on album cards, we need to:

1. Update `useAlbums` hook to use `getAlbumsWithCovers()`
2. Update `DraggableAlbumCard` to display `coverPhotoUrl`
3. Add "Set as Cover" button to photos

**Estimated time**: ~10 minutes

Would you like me to complete this now?

---

**Commit**: `d47ef20`
