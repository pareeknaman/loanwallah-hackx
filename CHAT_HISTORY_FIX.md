# Chat History Fix

## Problem
Chat history was not showing because the ChatSidebar component was trying to directly access Supabase from the client-side, which was blocked by Row Level Security (RLS) policies.

## Solution
Created API routes that use the Supabase Service Role Key to bypass RLS on the server side, allowing authenticated users to fetch their chats and messages.

## New API Routes Created

### 1. `/api/get-chats/route.ts`
- **Purpose**: Fetch all chats for the authenticated user
- **Method**: GET
- **Authentication**: Clerk authentication required
- **Returns**: List of chats with `id`, `title`, and `created_at`

### 2. `/api/get-messages/route.ts`
- **Purpose**: Fetch all messages for a specific chat
- **Method**: GET
- **Query Parameters**: `chatID` (required)
- **Authentication**: Clerk authentication required
- **Returns**: List of messages with `id`, `role`, `content`, and `created_at`

## Updated Components

### 1. ChatSidebar.tsx
- **Before**: Direct Supabase client access → Blocked by RLS
- **After**: Calls `/api/get-chats` API route → Works with Service Role Key
- **Result**: Chat history now displays in the sidebar

### 2. ChatPage.tsx ([chatID]/page.tsx)
- **Before**: Direct Supabase client access → Blocked by RLS
- **After**: Calls `/api/get-messages?chatID=X` API route → Works with Service Role Key
- **Result**: Messages load properly when opening an existing chat

## How It Works

1. **User authentication**: Clerk authenticates the user on the client side
2. **API call**: Client makes request to our API route
3. **Server-side auth**: API route verifies user with Clerk on the server
4. **Supabase access**: Server uses Service Role Key to fetch data from Supabase
5. **Data return**: Server returns data to client
6. **Display**: Client displays the chats/messages in the UI

## Testing

To verify chat history is working:

1. Sign in to the application
2. Create a new chat by clicking "New Chat"
3. Send a few messages in the chat
4. Create another chat
5. Check the sidebar - you should see both chats listed
6. Click on a chat - you should see all messages loaded

## Important Notes

- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your `.env.local` file
- The service role key bypasses RLS, so it should NEVER be exposed to the client
- All API routes verify authentication before accessing the database
- RLS policies still protect the database from unauthorized access via the anon key

