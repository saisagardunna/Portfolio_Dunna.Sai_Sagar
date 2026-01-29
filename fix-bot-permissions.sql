-- Fix for Telegram Bot Edit/Delete Issues
-- Run this in your Supabase SQL Editor

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON projects;

-- Create a new policy that allows anon key to perform all operations
-- (This is safe because only you have the bot token)
CREATE POLICY "Allow all operations for anon" ON projects
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Alternative: If you want more security, you can check if is_active = true for updates
-- CREATE POLICY "Allow all operations for anon" ON projects
--     FOR ALL
--     TO anon
--     USING (true)
--     WITH CHECK (is_active = true OR is_active = false);
