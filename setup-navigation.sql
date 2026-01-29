-- Create navigation_commands table for Telegram to webpage communication
CREATE TABLE IF NOT EXISTS navigation_commands (
    id BIGSERIAL PRIMARY KEY,
    command TEXT NOT NULL,
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_navigation_commands_created_at ON navigation_commands(created_at DESC);

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
