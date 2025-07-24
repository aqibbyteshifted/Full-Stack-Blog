'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or use system preference
    if (typeof window !== 'undefined') {
      const isDark = localStorage.theme === 'dark' || 
                    (!('theme' in localStorage) && 
                    window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
          darkMode ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
            darkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {darkMode ? (
            <Moon className="w-4 h-4 text-gray-800" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
        </div>
      </button>
    </div>
  );
}
