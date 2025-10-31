# Supabase Setup Instructions for LoanWallah

## Quick Fix for RLS Error

The error "new row violates row-level security policy" occurs because your Supabase database needs proper tables and policies set up.

## Step 1: Run the SQL Setup Script

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Copy and paste the contents of `supabase-setup.sql` into the editor
6. Click **"Run"** to execute the SQL

This will create:
- `chats` table
- `messages` table
- All necessary indexes
- Row Level Security (RLS) policies
- Automatic timestamp triggers

## Step 2: Add Service Role Key to Environment Variables

You need to add your Supabase Service Role Key to bypass RLS on the server side.

1. In your Supabase Dashboard, go to **Settings** → **API**
2. Find your **"service_role"** key (NOT the anon key - this is a secret key!)
3. Copy the key
4. Open your `.env.local` file
5. Add this line:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
6. Save the file
7. Restart your Next.js dev server

## Important: Don't Commit the Service Role Key

The `.env.local` file should already be in your `.gitignore`. Make sure you NEVER commit your `SUPABASE_SERVICE_ROLE_KEY` to version control!

## Step 3: Verify Your Environment Variables

Your `.env.local` file should now have:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Shivaay LLM
SHIVAAY_API_KEY=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # NEW: This is the secret key!
```

## How It Works

The new flow:
1. Client clicks "Consult Assistant" → navigates to `/assistant`
2. Client calls `/api/create-chat` API route
3. Server authenticates with Clerk
4. Server uses Supabase Service Role Key to bypass RLS
5. Server creates chat in database
6. Server returns chat ID to client
7. Client redirects to `/assistant/[chatID]`

This is more secure because:
- RLS still protects the database from unauthorized access
- Only your server (with the secret key) can bypass RLS
- Client never sees the service role key
- All client operations still respect RLS

## Testing

After completing these steps:
1. Restart your Next.js server: `npm run dev`
2. Sign in to your app
3. Click "Consult Assistant"
4. You should see "Creating new chat..." briefly
5. You should be redirected to the chat interface

If you still get errors, check:
- Browser console for client-side errors
- Terminal for server-side errors
- Supabase logs in the dashboard
- That your `.env.local` has all required keys

