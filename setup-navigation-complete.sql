-- ========================================
-- COMPLETE NAVIGATION COMMANDS TABLE SETUP
-- Run this ENTIRE script in Supabase SQL Editor
-- ========================================

-- Create navigation_commands table for Telegram to webpage communication
CREATE TABLE IF NOT EXISTS navigation_commands (
    id BIGSERIAL PRIMARY KEY,
    command TEXT NOT NULL,
    project_id INTEGER,
    project_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE navigation_commands ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since this is for your personal use)
CREATE POLICY "Allow all operations on navigation_commands"
    ON navigation_commands
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_navigation_commands_created_at ON navigation_commands(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_navigation_commands_project_id ON navigation_commands(project_id);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE navigation_commands;

-- Optional: Add cleanup function to prevent table from growing too large
-- This will delete commands older than 1 hour (they're no longer needed)
CREATE OR REPLACE FUNCTION cleanup_old_navigation_commands()
RETURNS void AS $$
BEGIN
    DELETE FROM navigation_commands
    WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Add helpful comments
COMMENT ON TABLE navigation_commands IS 'Stores navigation commands from Telegram bot to control the webpage';
COMMENT ON COLUMN navigation_commands.command IS 'Navigation command type (e.g., projects, home, open_project)';
COMMENT ON COLUMN navigation_commands.project_id IS 'Project ID when opening a specific project demo';
COMMENT ON COLUMN navigation_commands.project_url IS 'Project URL to open when command is open_project';

-- Verify the setup
SELECT 'Navigation commands table created successfully! ✅' AS status;
SELECT COUNT(*) AS current_commands FROM navigation_commands;
