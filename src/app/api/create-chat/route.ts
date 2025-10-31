import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  try {
    // Create a Supabase client with service role key for server-side operations
    // Note: You should add SUPABASE_SERVICE_ROLE_KEY to your .env.local
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

    // Create a new chat
    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: userId,
        title: 'New Chat'
      })
      .select('id')
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ chatID: data.id });
  } catch (error: any) {
    console.error("Failed to create chat:", error);
    return NextResponse.json(
      { error: 'Failed to create chat.' },
      { status: 500 }
    );
  }
}

