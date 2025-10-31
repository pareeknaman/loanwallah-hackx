"use client";

import React, { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Paperclip, Volume2, VolumeX, Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useUser } from '@clerk/nextjs';

interface Message {
  id?: number | string;
  role: 'user' | 'bot';
  content: string;
}

// This component is for a specific chat, loaded via its ID from params
export default function ChatPage({ params }: { params: Promise<{ chatID: string }> }) {
  const { chatID } = use(params);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. --- LOAD CHAT HISTORY AND SCROLL ---
  useEffect(() => {
    if (!user || !chatID) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Fetch messages for the specific chatID using API route
        const res = await fetch(`/api/get-messages?chatID=${chatID}`);

        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await res.json();

        if (data.messages.length === 0) {
          // No history, add the welcome message
          setMessages([{
            id: 'initial',
            role: 'bot',
            content: "Hi there! I'm your personal loan assistant. How can I help you today?"
          }]);
        } else {
          // Cast Supabase data to our Message interface
          setMessages(data.messages as Message[]);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([{
          id: 'error',
          role: 'bot',
          content: 'Error loading messages. Please check your Supabase connection and try again.'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [user, chatID]);

  // Auto-scroll to the bottom of the chat when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 2. --- HANDLE CHAT SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput) return;

    const newUserMessage: Message = {
      id: Date.now(), // Temporary ID for UI
      role: 'user',
      content: currentInput,
    };

    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send chatID and full history
        body: JSON.stringify({
          messages: newMessages,
          chatID: chatID // Pass the current chat ID
        })
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        content: data.response
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        content: 'Sorry, I ran into an error. Please try again.'
      }]);
    }
  };

  // 3. --- HANDLE FILE UPLOAD ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'bot',
      content: `Uploading ${file.name}...`
    }]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev,
          { id: Date.now() + 1, role: 'user', content: `Uploaded ${data.fileName || file.name}` },
          { id: Date.now() + 2, role: 'bot', content: data.summary || data.response || 'File processed successfully.' }
        ]);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        content: `Upload failed: ${error.message || 'Unknown error'}`
      }]);
    }

    if (e.target) e.target.value = '';
  };

  // 4. --- SPEECH HANDLERS ---
  const handleListen = () => {
    if (isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setInput("Listening...");
    };

    recognition.onend = () => {
      setIsListening(false);
      if (document.activeElement === document.body) setInput("");
    };

    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setInput("");
    };

    recognition.start();
  };

  useEffect(() => {
    if (!isTtsEnabled) {
      speechSynthesis.cancel();
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'bot') {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lastMessage.content);
      speechSynthesis.speak(utterance);
    }
  }, [messages, isTtsEnabled]);

  // 5. --- JSX / UI ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <Card className="w-full h-full flex flex-col bg-[#1C1C1C] rounded-lg border border-gray-700 shadow-2xl overflow-hidden min-h-0">
        {/* Card Header: New Chat / History */}
        <div className="p-4 flex justify-between items-center border-b border-gray-700 shrink-0">
          <h2 className="text-xl font-semibold text-white">Loan Assistant</h2>
          {/* The buttons are now controlled by the ChatSidebar component, which is the main New Chat/History UI */}
        </div>

        {/* Card Content: Chat Area */}
        <CardContent className="flex-grow p-4 overflow-y-auto" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || `msg-${index}`}
                className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}>
                  <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert' : ''}`}>
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        {/* Card Footer: Input Bar */}
        <CardFooter className="p-4 border-t border-gray-700 shrink-0">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <Button type="button" variant="outline" size="icon" className="shrink-0 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white" onClick={() => setIsTtsEnabled(prev => !prev)}>
              {isTtsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button type="button" variant="outline" size="icon" className="shrink-0 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="application/pdf"
            />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-transparent text-white border-gray-600 placeholder:text-gray-400"
            />
            <Button type="button" variant="outline" size="icon" className="shrink-0 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white" onClick={handleListen}>
              <Mic className={isListening ? "h-4 w-4 animate-pulse text-red-500" : "h-4 w-4"} />
            </Button>
            <Button type="submit" variant="default" size="icon" className="shrink-0 bg-white text-black hover:bg-gray-200">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
