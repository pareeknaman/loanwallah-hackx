"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AssistantPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    const createNewChat = async () => {
      if (!user) {
        // If user is not authenticated, redirect to sign-in
        router.push('/sign-in');
        return;
      }

      try {
        // Call our API route to create a new chat
        const res = await fetch('/api/create-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create chat');
        }

        const data = await res.json();

        // Redirect to the new chat
        if (data.chatID) {
          router.push(`/assistant/${data.chatID}`);
        }
      } catch (err: any) {
        console.error("Failed to create chat:", err);
        console.error("Error details:", {
          message: err?.message,
        });
        
        // Show error to user
        alert(`Failed to create chat: ${err?.message || 'Unknown error'}. Please check your Supabase connection.`);
        
        // Fallback: redirect to a random UUID (for development/testing)
        // In production, you should handle this error better
        const fallbackId = crypto.randomUUID();
        console.warn(`Using fallback chat ID: ${fallbackId}`);
        router.push(`/assistant/${fallbackId}`);
      }
    };

    createNewChat();
  }, [user, isLoaded, router]);

  // Show loading state while creating chat
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-400">Creating new chat...</p>
    </div>
  );
}

