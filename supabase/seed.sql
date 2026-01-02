-- Photo Album Organizer: Development Seed Data
-- Use this file to populate local development with test data
-- Run with: supabase db reset (this will run migrations + seed)

-- Note: This seed file assumes you have a test user created
-- You can create a test user through Supabase Studio or Auth UI

-- Example: Insert test albums for a specific user
-- Replace 'your-user-uuid' with an actual user ID from auth.users

-- INSERT INTO albums (user_id, name, position, has_custom_order, created_at)
-- VALUES
--   ('your-user-uuid', 'Summer 2026', 'a0', false, '2026-06-15 10:00:00+00'),
--   ('your-user-uuid', 'Family Photos', 'a1', false, '2026-05-20 10:00:00+00'),
--   ('your-user-uuid', 'Vacation', 'a2', false, '2026-04-10 10:00:00+00');

-- To create test data:
-- 1. Start local Supabase: supabase start
-- 2. Open Studio: http://localhost:54323
-- 3. Create a test user in Authentication
-- 4. Copy the user's UUID
-- 5. Uncomment and update the INSERT statements above
-- 6. Run: supabase db reset

SELECT 'Seed file ready - uncomment INSERT statements after creating a test user' AS message;
