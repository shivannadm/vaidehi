import type { Metadata } from "next";
import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(
  () => import("@/app/(landing)/components/AnimatedBackground"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Authentication - Vaidehi",
  description: "Sign in to your trading journal",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <AnimatedBackground />
      
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl" 
             style={{ animationDelay: "2s" }} />
      </div>

      {/* Logo at top */}
      <div className="absolute top-8 left-8">
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-bold text-2xl text-indigo-600">
            V<span className="text-black">aidehi</span>
          </span>
        </a>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}