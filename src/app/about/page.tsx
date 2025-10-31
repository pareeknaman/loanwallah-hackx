import { CubeGraphic } from "@/components/CubeGraphic"; // Import our background graphic
import { Bot, FileText, ShieldCheck, Mic } from "lucide-react"; // Import icons

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white relative p-8 md:p-24 flex flex-col items-center">
      {/* Faded Background Graphic (Covers entire page) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CubeGraphic />
      </div>

      {/* Content Wrapper (sits on top of the background) */}
      <div className="relative z-10 w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">About LoanWallah</h1>
        <p className="text-lg text-gray-300 text-center mb-12">
          LoanWallah was built to solve one problem: the traditional loan process is slow, impersonal, and confusing. We replace endless forms and robotic chatbots with a genuine, expert assistant to make securing your financial future as simple as having a conversation.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-center">Core Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-[#1C1C1C] rounded-lg border border-gray-700">
            <Bot size={28} className="text-white mb-3" />
            <h3 className="text-xl font-semibold mb-2">Agentic Conversational AI</h3>
            <p className="text-gray-400">
              Powered by the **Shivaay LLM**, our assistant holds natural, context-aware conversations, remembers your needs, and provides expert financial advice.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-[#1C1C1C] rounded-lg border border-gray-700">
            <ShieldCheck size={28} className="text-white mb-3" />
            <h3 className="text-xl font-semibold mb-2">Secure, Automated Workflow</h3>
            <p className="text-gray-400">
              An autonomous backend that handles real-time KYC and credit checks to pre-approve your loan in seconds, all triggered by the AI's conversation.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-[#1C1C1C] rounded-lg border border-gray-700">
            <FileText size={28} className="text-white mb-3" />
            <h3 className="text-xl font-semibold mb-2">Document Handling</h3>
            <p className="text-gray-400">
              Upload your existing loan applications (text-based PDFs) for instant AI-powered analysis, or receive your automatically-generated sanction letter.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-[#1C1C1C] rounded-lg border border-gray-700">
            <Mic size={28} className="text-white mb-3" />
            <h3 className="text-xl font-semibold mb-2">Voice-Enabled Interface</h3>
            <p className="text-gray-400">
              Full accessibility with integrated Speech-to-Text and Text-to-Speech, powered by the browser's native Web Speech API.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Project Origin</h2>
        <p className="text-lg text-gray-400 text-center max-w-2xl mx-auto">
          LoanWallah is a proof-of-concept built for the **HackX 3.0 Hackathon**. It demonstrates a modern, agentic AI architecture using Next.js, Clerk, and the sponsor-provided Shivaay LLM.
        </p>
      </div>
    </main>
  );
}
