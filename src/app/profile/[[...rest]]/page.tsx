"use client";

import { UserProfile } from "@clerk/nextjs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  // Read the 'tab' query parameter (e.g., ?tab=history)
  const initialTab = searchParams.get('tab') === 'history' ? 'history' : 'account';

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue={initialTab} className="w-full">
          {/* These are the navigation tabs */}
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-[#1C1C1C] border-gray-700">
            <TabsTrigger value="account">Account Settings</TabsTrigger>
            <TabsTrigger value="history">Chat History</TabsTrigger>
          </TabsList>

          {/* 1. Account Settings Tab */}
          <TabsContent value="account" className="mt-6">
            <Card className="bg-[#1C1C1C] border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Manage Your Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your profile information, email addresses, and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Clerk's UserProfile component is embedded here */}
                <UserProfile appearance={{
                  baseTheme: undefined,
                  elements: {
                    card: "bg-transparent shadow-none",
                    rootBox: "w-full",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    navbar: "hidden",
                    pageScrollBox: "p-0",
                  }
                }} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Chat History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card className="bg-[#1C1C1C] border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Your Past Conversations</CardTitle>
                <CardDescription className="text-gray-400">
                  Review your previous loan discussions and sanction letters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  [Chat history from Supabase will go here!]
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
