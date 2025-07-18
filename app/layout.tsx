import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/common-ui/footer/page";
import { ThemeProvider } from "next-themes";
import Navbar from "@/common-ui/header/page";
import { ClerkProvider } from "@clerk/nextjs";
import { barlow, barlowCondensed } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Full Stack Blog",
  description: "Created with Clerk, Next.js, Tailwind CSS, and Prisma",
  keywords: ["blog", "full stack", "clerk", "next.js", "tailwind css", "prisma"],
  authors: [{ name: "John Doe" }],
  publisher: "John Doe",
  
 };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable} font-sans`}>
        <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
