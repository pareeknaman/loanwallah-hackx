"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

interface Chat {
  id: string;
  title: string;
}

export function ChatSidebar() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams(); // Get the current chatID from the URL
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all chats for the current user
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/get-chats');
        
        if (!res.ok) {
          throw new Error('Failed to fetch chats');
        }

        const data = await res.json();
        console.log("Fetched chats:", data.chats?.length || 0, "chats found");
        setChats(data.chats || []);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, params.chatID]); // Refetch when chatID changes

  // 2. Handle the "New Chat" button click
  const handleNewChat = () => {
    // Navigates to the /assistant page, which automatically creates and redirects to a new chat ID
    router.push('/assistant');
  };

  // Determine the active chat ID for styling
  const activeChatId = Array.isArray(params.chatID) ? params.chatID[0] : params.chatID;

  return (
    <div className="w-1/4 bg-[#1C1C1C] border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <Button
          onClick={handleNewChat}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Chat History temporarily disabled */}
      {/* <h2 className="text-sm font-semibold text-gray-400 mt-6 mb-2 px-2">
        Chat History
      </h2>

      <div className="flex-grow overflow-y-auto space-y-1">
        {loading && <p className="text-gray-400 text-sm">Loading chats...</p>}

        {!loading && chats.length === 0 && (
          <p className="text-gray-400 text-sm p-2">No chats yet.</p>
        )}

        {!loading && chats.map((chat) => (
          <Link
            href={`/assistant/${chat.id}`}
            key={chat.id}
            className={`flex items-center p-2 rounded-md transition-colors w-full text-sm ${
              chat.id === activeChatId
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="truncate">{chat.title}</span>
          </Link>
        ))}
      </div> */}
    </div>
  );
}

