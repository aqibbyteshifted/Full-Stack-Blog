'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMoon, FiSun, FiMenu, FiX, FiUser, FiLogIn } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

// Navigation links
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Pages', href: '/pages' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useUser();

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch('/api/auth/role');
          const data = await response.json();
          setIsAdmin(data.role === 'ADMIN');
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };
    
    checkAdmin();
  }, [isSignedIn, user]);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return null; // Prevents hydration mismatch
  }

  return (
    <div className="relative">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-2 shadow-sm' : 'bg-white dark:bg-gray-900 py-4'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  Athena
                </span>
                <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">Creative Magazine</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                Contact
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
              </button>

              {/* Notifications */}
              <button 
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* User Profile */}
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="hidden md:block text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user?.firstName || 'User'}
                      {isAdmin && ' (Admin)'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <button className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                      <FiLogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-20 transition-transform duration-300 ease-in-out transform md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xl font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-xl font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
            
            {/* Mobile Theme Toggle */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newTheme = theme === 'dark' ? 'light' : 'dark';
                  document.documentElement.classList.toggle('dark');
                  setTheme(newTheme);
                }}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <FiSun className="h-5 w-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
