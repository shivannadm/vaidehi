import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import DashboardShell from "./components/DashboardShell";
import { ThemeScript } from "./components/theme-script";

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
            <DashboardShell>{children}</DashboardShell>
        </>
    );
}