// app/dashboard/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import DashboardShell from "./components/DashboardShell";
import { ThemeScript } from "./components/theme-script";

// Import the TimerProvider
import { TimerProvider } from "./components/TimerContext";

export const metadata: Metadata = {
  title: "Dashboard - Vaidehi",
  description: "Your trading journal dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <ThemeScript />
      {/* TimerProvider wraps DashboardShell + children */}
      <TimerProvider userId={user.id}>
        <DashboardShell>{children}</DashboardShell>
      </TimerProvider>
    </>
  );
}