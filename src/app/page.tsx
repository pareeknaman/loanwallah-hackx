import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot, ShieldCheck, FileText } from "lucide-react";
import { CubeGraphic } from "@/components/CubeGraphic"; // Import our new graphic

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] text-white relative">
      {/* Faded Background Graphic (Covers entire page) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CubeGraphic />
      </div>

      {/* Content Wrapper (sits on top of the background) */}
      <div className="relative z-10 w-full">
        {/* --- Hero Section --- */}
        <section className="w-full flex flex-col items-center justify-center text-center p-24 relative overflow-hidden">
          {/* Fills the background of this section */}
          <div className="absolute inset-0">
            {/* The radial gradient for the "smoky" effect */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#111111]"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4">Welcome</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Your personal AI-powered loan assistant. Get advice, check eligibility, and secure your financial future, all through a simple conversation.
            </p>
            <Button asChild size="lg" className="bg-white text-black font-bold hover:bg-gray-200 text-md px-8 py-6">
              <Link href="/assistant">
                Consult Assistant
              </Link>
            </Button>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="w-full max-w-5xl mx-auto p-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            A New Way to Get Your Loan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-[#1C1C1C] rounded-lg border border-gray-700">
              <Bot size={48} className="text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2">Conversational AI</h3>
              <p className="text-gray-400">
                No more forms. Just have a natural conversation, get advice, and let our AI handle the work.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-[#1C1C1C] rounded-lg border border-gray-700">
              <ShieldCheck size={48} className="text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Verification</h3>
              <p className="text-gray-400">
                Our agent securely verifies your profile and creditworthiness in real-time, all within the chat.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-[#1C1C1C] rounded-lg border border-gray-700">
              <FileText size={48} className="text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2">Application Sent for Sanction</h3>
              <p className="text-gray-400">
                Once you're approved, our system sends your application for quick sanction.
              </p>
            </div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="w-full p-16 bg-[#1C1C1C]">
          <h2 className="text-3xl font-bold text-center mb-12">
            Get Your Loan in 3 Simple Steps
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-white mb-2">1.</div>
              <h3 className="text-xl font-semibold mb-2">Chat & Consult</h3>
              <p className="text-gray-400">Talk to our AI assistant about your financial needs, just like a real person.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-white mb-2">2.</div>
              <h3 className="text-xl font-semibold mb-2">Verify Eligibility</h3>
              <p className="text-gray-400">When you're ready, provide your PAN to run an instant, secure credit check.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-white mb-2">3.</div>
              <h3 className="text-xl font-semibold mb-2">Get Your Letter</h3>
              <p className="text-gray-400">If approved, you'll get a PDF sanction letter sent to you by the financial institution.</p>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="w-full p-8 text-center text-gray-500 border-t border-gray-700/50">
          <p>© 2025 LoanWallah. All rights reserved. Built for HackX 3.0.</p>
        </footer>
      </div> {/* End of content wrapper */}
    </main>
  );
}
