import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "Minimalistic journaling + trading routine app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
