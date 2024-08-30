import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "sonner";

import ConvexClientProvider from "./_components/ConvexClientProvider";
import { cn } from "@/lib/utils";




export const metadata: Metadata = {
  title: "Easy Rag",
  description: "Chatbots made easy",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Toaster position="top-center" richColors />
          {children}
        </body>
      </html>
    </ConvexClientProvider>
  );
}
