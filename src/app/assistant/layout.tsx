"use client";

import { ChatSidebar } from "@/components/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden bg-[#111111]">
      <ChatSidebar />
      {/* This is the chat window */}
      <div className="w-3/4 flex p-4 h-full">
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

