import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  try {
    // Create a Supabase client with service role key for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseServiceKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables");
      return NextResponse.json(
        { error: 'Server configuration error.' }, 
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Fetch all chats for the authenticated user
    const { data, error } = await supabase
      .from('chats')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log(`Found ${data?.length || 0} chats for user ${userId}`);
    if (data && data.length > 0) {
      console.log("Sample chat titles:", data.slice(0, 3).map(c => c.title));
    }

    return NextResponse.json({ chats: data || [] });
  } catch (error: any) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json(
      { error: 'Failed to fetch chats.' },
      { status: 500 }
    );
  }
}

