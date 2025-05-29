-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    -- Add a constraint to ensure sender and receiver are different
    CONSTRAINT different_sender_receiver CHECK (sender_id != receiver_id)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_id_idx ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS messages_service_id_idx ON messages(service_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);
-- Composite index for conversation lookup
CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages(
    LEAST(sender_id, receiver_id),
    GREATEST(sender_id, receiver_id),
    created_at DESC
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Users can view messages where they are either sender or receiver
CREATE POLICY "Users can view their own messages"
    ON messages FOR SELECT
    USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
    );

-- 2. Users can insert messages (as sender)
CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- 3. Users can update their own messages (mark as read)
CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = receiver_id)
    WITH CHECK (
        -- Only allow updating is_read status
        OLD.sender_id = NEW.sender_id AND
        OLD.receiver_id = NEW.receiver_id AND
        OLD.service_id = NEW.service_id AND
        OLD.content = NEW.content AND
        OLD.created_at = NEW.created_at AND
        -- Only allow changing is_read from false to true
        (OLD.is_read = false AND NEW.is_read = true)
    );

-- 4. Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
    ON messages FOR DELETE
    USING (auth.uid() = sender_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 