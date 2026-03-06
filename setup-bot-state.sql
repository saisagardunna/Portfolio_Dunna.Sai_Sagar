-- Create a table to store Telegram user states for multi-step commands
CREATE TABLE IF NOT EXISTS bot_states (
    chat_id BIGINT PRIMARY KEY,
    user_id BIGINT,
    action TEXT,          -- 'add' or 'edit'
    step TEXT,            -- current step name (e.g. 'title', 'tech', 'category')
    data JSONB DEFAULT '{}'::jsonb, -- Temporary data storage (e.g. partial project info)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (optional, but good practice)
ALTER TABLE bot_states ENABLE ROW LEVEL SECURITY;

-- Allow public access (since the bot uses the anon key or service role)
-- For simplicity in this context, we'll allow all access, but in production, 
-- you'd likely restrict this to the service role or authenticated users.
CREATE POLICY "Allow public access to bot_states" ON bot_states
    FOR ALL
    USING (true)
    WITH CHECK (true);
