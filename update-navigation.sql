-- Update navigation_commands table to support opening project demos
-- Run this in your Supabase SQL Editor

-- Add new columns if they don't exist
ALTER TABLE navigation_commands 
ADD COLUMN IF NOT EXISTS project_id INTEGER,
ADD COLUMN IF NOT EXISTS project_url TEXT;

-- Add index for project_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_navigation_commands_project_id ON navigation_commands(project_id);

-- Add comment to explain the table structure
COMMENT ON TABLE navigation_commands IS 'Stores navigation commands from Telegram bot to control the webpage';
COMMENT ON COLUMN navigation_commands.command IS 'Navigation command type (e.g., projects, home, open_project)';
COMMENT ON COLUMN navigation_commands.project_id IS 'Project ID when opening a specific project demo';
COMMENT ON COLUMN navigation_commands.project_url IS 'Project URL to open when command is open_project';
