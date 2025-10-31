import { NextRequest, NextResponse } from 'next/server';
import { runKycAgent, runSanctionAgent } from '@/lib/agents';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export async function POST(req: NextRequest) {
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
        { response: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { messages: fullMessageHistory, chatID } = await req.json() as { messages: Message[], chatID: string };

    if (!fullMessageHistory || fullMessageHistory.length === 0) {
      return NextResponse.json({ response: "Sorry, I received an empty message." }, { status: 400 });
    }

    // Get the most recent user message to save
    const userMessage = fullMessageHistory[fullMessageHistory.length - 1];

    // 1. Prepare messages for LLM
    const systemPrompt = {
      role: "system",
      content: `You are a professional loan sales assistant. Your tone is friendly, professional, and helpful.

**RULES:**
1. **Remember Context:** Read the entire chat history. If the user mentions a 'wedding' or a 'house' loan, REMEMBER that context for all future messages.
2. **Consult:** Have a natural conversation. Be an advisor.
3. **Propose Check:** After a helpful discussion, propose the eligibility check. Example: "If you'd like, I can run a quick pre-approval check for you. I would just need your 10-digit PAN card number to get started."
4. **Handle PAN:** When a user's *last message* is clearly a 10-digit PAN card number, you MUST respond *only* with the trigger: \`[AGENT_TASK: RUN_KYC: PAN_NUMBER_HERE]\`. Do not add any other text.`
    };

    const apiMessages = [
      systemPrompt,
      ...fullMessageHistory.map((m) => ({
        role: m.role === 'bot' ? 'assistant' : m.role,
        content: m.content,
      })),
    ];

    const res = await fetch('https://api.futurixai.com/api/lara/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SHIVAAY_API_KEY}`
      },
      body: JSON.stringify({
        model: "shivaay",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 512,
        stream: false
      })
    });

    if (!res.ok) throw new Error("LLM API request failed");

    const json_response = await res.json();
    const bot_reply_content = json_response.choices[0].message.content;

    // 2. CHECK FOR AGENT TRIGGER (KYC/SANCTION)
    const trigger = "[AGENT_TASK: RUN_KYC:";
    let finalBotResponse = bot_reply_content;

    if (bot_reply_content.trim().startsWith(trigger)) {
      console.log("[API] Received agent trigger from LLM.");

      // Logic to run KYC and Sanction Agent
      const panNumber = bot_reply_content.substring(trigger.length, bot_reply_content.length - 1).trim();
      const kycResult = await runKycAgent(panNumber, fullMessageHistory);

      if (kycResult.status === 'error') {
        finalBotResponse = kycResult.message;
      } else {
        const sanctionData = await runSanctionAgent(kycResult.data);
        finalBotResponse = `Great news, ${kycResult.data.fullName}! Your KYC is complete (Credit Score: ${kycResult.data.creditScore}). You are pre-approved for a loan of ₹${sanctionData.sanctionedAmount.toLocaleString('en-IN')}. Your sanction letter is ready: [Download Letter](${sanctionData.pdfUrl})`;

        // Update chat title on successful loan
        await supabase.from('chats').update({ title: `Loan Approved for ${kycResult.data.fullName}` }).eq('id', chatID);
      }
    }

    // 3. SAVE MESSAGES TO SUPABASE
    // Check if this chat already has messages in the database (before inserting)
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chatID);
    
    const hasExistingMessages = (count || 0) > 0;
    
    // Save user message first
    await supabase.from('messages').insert({
      chat_id: chatID,
      user_id: userId,
      role: 'user',
      content: userMessage.content,
    });

    // Save bot response
    await supabase.from('messages').insert({
      chat_id: chatID,
      user_id: userId,
      role: 'bot',
      content: finalBotResponse,
    });

    // 4. Update initial chat title (after first message)
    // Only update title if this was the first message pair
    if (!hasExistingMessages) {
      const newTitle = userMessage.content.substring(0, 30) + '...';
      const { error: updateError } = await supabase.from('chats').update({ title: newTitle }).eq('id', chatID);
      
      if (updateError) {
        console.error("Failed to update chat title:", updateError);
      } else {
        console.log(`Updated chat ${chatID} title to: "${newTitle}"`);
      }
    }

    return NextResponse.json({ response: finalBotResponse });

  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ response: "An internal server error occurred." }, { status: 500 });
  }
}

