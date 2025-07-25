'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Footer from "@/common-ui/footer/page";
import Header from "@/common-ui/header/page";
import NewsletterPopup from '@/app/components/NewsletterPopupWrapper';
import dynamic from 'next/dynamic';

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
            <NewsletterPopup />
            <Header />
            <main className="flex-1 pt-20 relative">
              {children}
              <ThemeToggle />
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </ThemeProvider>
  );
}
