import { SignUp } from "@clerk/nextjs";
import { CubeGraphic } from "@/components/CubeGraphic"; // Import our new graphic

export default function Page() {
  return (
    <main className="min-h-screen flex">
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Side: Graphic */}
        <div className="bg-[#1C1C1C] relative overflow-hidden h-64 md:h-auto md:w-1/2">
          {/* The smoky/wavy gradient */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(30, 30, 30, 0.5) 0%, rgba(28, 28, 28, 1) 70%)' }}></div>
          <CubeGraphic />
          {/* Fades the edges */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C] via-transparent to-[#1C1C1C]"></div>
        </div>

        {/* Right Side: Clerk Sign-Up Form */}
        <div className="bg-white p-12 md:w-1/2 flex items-center justify-center">
          <SignUp />
        </div>
      </div>
    </main>
  );
}
