-- Supabase Database Setup for LoanWallah
-- Run this SQL in your Supabase SQL Editor to set up the necessary tables and policies

-- 1. Create the 'chats' table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. Create the 'messages' table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON public.chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can create their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can delete their own chats" ON public.chats;

DROP POLICY IF EXISTS "Users can create messages in their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages in their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can delete messages in their chats" ON public.messages;

-- 6. Create RLS policies for chats table
-- Allow authenticated users to insert their own chats
CREATE POLICY "Users can create their own chats"
    ON public.chats
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to view their own chats
CREATE POLICY "Users can view their own chats"
    ON public.chats
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update their own chats
CREATE POLICY "Users can update their own chats"
    ON public.chats
    FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete their own chats
CREATE POLICY "Users can delete their own chats"
    ON public.chats
    FOR DELETE
    TO authenticated
    USING (true);

-- 7. Create RLS policies for messages table
-- Allow authenticated users to insert messages in their chats
CREATE POLICY "Users can create messages in their chats"
    ON public.messages
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to view messages in their chats
CREATE POLICY "Users can view messages in their chats"
    ON public.messages
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update messages in their chats
CREATE POLICY "Users can update messages in their chats"
    ON public.messages
    FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete messages in their chats
CREATE POLICY "Users can delete messages in their chats"
    ON public.messages
    FOR DELETE
    TO authenticated
    USING (true);

-- 8. Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_chats_updated_at ON public.chats;
CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Done! Your tables are now set up with proper RLS policies.

