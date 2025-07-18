'use client';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { fetchUserRole } from '@/app/actions/auth';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isSignedIn } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const userRole = await fetchUserRole();
        setRole(userRole?.role || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      }
    };
    if (isSignedIn) {
      getRole();
    } else {
      setRole(null);
    }
  }, [isSignedIn]);

  return (
    <header className="w-full bg-gray-200 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col justify-between items-center">

        {/* Logo Section */}
        <div className="flex items-center space-x-2 pb-16">
          <div className="text-xl font-bold text-center text-athena-red hover:cursor-pointer">
            <Image
              src="/logo.png"
              width={140}
              height={140}
              alt="Picture of the author"
            />
            <h4 className="text-[12px] font-[500] hover:text-red-500">Creative Magazine</h4>
          </div>
        </div>

        {/* Navigation Container */}
        <div className="flex items-center justify-between w-full">
          {/* Toggle Menu Button for Mobile - Two Line Hamburger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="">
                <div className="flex flex-col justify-center items-center space-y-1 hover:cursor-pointer">
                  <div className="w-8 h-[1.5px] bg-[#000000] hover:bg-red-700"></div>
                  <div className="w-8 h-[1.5px] bg-[#000000] hover:bg-red-700"></div>
                  <div className="w-8 h-[1.5px] bg-[#000000]"></div>
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full h-full bg-black text-white p-0 border-none">
              <div className="flex flex-col h-full">
                {/* Close Button */}
                <div className="flex justify-start p-6">
                  <button onClick={() => setIsSheetOpen(false)} className="text-white hover:text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Menu Categories */}
                <nav className="flex-1 px-6 py-8">
                  <div className="space-y-8">
                    <div className="relative">
                      <Link href="/technology" className="text-4xl md:text-5xl font-light text-white hover:text-red-500 transition-colors">
                        Technology
                      </Link>
                      <span className="absolute -top-2 -right-4 text-sm text-gray-400">1</span>
                    </div>

                    <div className="relative">
                      <Link href="/travel" className="text-4xl md:text-5xl font-light text-white hover:text-red-500 transition-colors">
                        Travel
                      </Link>
                      <span className="absolute -top-2 -right-4 text-sm text-gray-400">3</span>
                    </div>

                    <div>
                      <Link href="/fashion" className="text-4xl md:text-5xl font-light text-white hover:text-red-500 transition-colors">
                        Fashion
                      </Link>
                    </div>

                    <div className="relative">
                      <Link href="/health" className="text-4xl md:text-5xl font-light text-white hover:text-red-500 transition-colors">
                        Health & Fitness
                      </Link>
                      <span className="absolute -top-2 -right-4 text-sm text-gray-400">4</span>
                    </div>
                  </div>
                </nav>

                {/* Social Links */}
                <div className="px-6 pb-8">
                  <h3 className="text-lg font-semibold text-white mb-6">FOLLOW US</h3>
                  <div className="space-y-4">
                    <Link href="#" className="flex items-center space-x-3 text-white hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                      <span>X (Twitter)</span>
                    </Link>
                    <Link href="#" className="flex items-center space-x-3 text-white hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <span>Facebook</span>
                    </Link>
                    <Link href="#" className="flex items-center space-x-3 text-white hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span>YouTube</span>
                    </Link>
                    <Link href="#" className="flex items-center space-x-3 text-white hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.344-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                      </svg>
                      <span>Instagram</span>
                    </Link>
                  </div>

                  {/* Footer Text */}
                  <div className="mt-8 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">ATHENA - MINIMAL BLOG & MAGAZINE</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:underline flex items-center">
              <span className="w-2 h-2 border-2 border-red-500 rounded-full mr-2"></span>Home
            </Link>
            <Link href="/pages" className="hover:underline flex items-center">
              <span className="w-2 h-2 border-2 border-red-500 rounded-full mr-2"></span>Pages
            </Link>
            <Link href="/blog" className="hover:underline flex items-center">
              <span className="w-2 h-2 border-2 border-red-500 rounded-full mr-2"></span>Blog
            </Link>
            <Link href="/contact" className="hover:underline flex items-center">
              <span className="w-2 h-2 border-2 border-red-500 rounded-full mr-2"></span>Contact
            </Link>
          </nav>

          {/* Right End Features */}
          <div className="flex items-center space-x-2">
            {/* Admin Login Button */}
            {!isSignedIn && (
              <SignInButton mode="modal">
                <Button variant="outline" className="bg-black text-white">Admin Login</Button>
              </SignInButton>
            )}
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.65 7.5 7.5 0 0116.65 16.65z"
                />
              </svg>
            </Button>
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search..."
                className="border rounded p-1 ml-2"
                onBlur={() => setIsSearchOpen(false)}
              />
            )}

            {/* Light/Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM6.166 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591zM3 12a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h.75A.75.75 0 013 12zM6.166 5.106a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.061-1.061l-1.59 1.591zM12 21a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75A.75.75 0 0112 21zM17.834 18.894a.75.75 0 001.061-1.06l-1.59-1.591a.75.75 0 10-1.061 1.061l1.59 1.591z" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}