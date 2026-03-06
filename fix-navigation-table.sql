-- ============================================================
-- RUN THIS in your Supabase SQL Editor to fix navigation
-- Go to: https://supabase.com/dashboard → SQL Editor → Run
-- ============================================================

-- Step 1: Add missing columns if they don't exist
ALTER TABLE navigation_commands ADD COLUMN IF NOT EXISTS project_url TEXT;
ALTER TABLE navigation_commands ADD COLUMN IF NOT EXISTS project_id INTEGER;

-- Step 2: Make sure RLS allows all operations
DROP POLICY IF EXISTS "Allow all operations on navigation_commands" ON navigation_commands;
CREATE POLICY "Allow all operations on navigation_commands"
    ON navigation_commands FOR ALL
    USING (true) WITH CHECK (true);

-- Step 3: Re-enable realtime (in case it was missed)
ALTER PUBLICATION supabase_realtime ADD TABLE navigation_commands;

-- Step 4: Verify
SELECT 'Table fixed! ✅' AS status;
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'navigation_commands';
