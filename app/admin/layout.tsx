"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const navItems = [
  { name: 'Dashboard', href: '/admin', tab: 'dashboard', icon: '📊' },
  { name: 'Add Blog', href: '/admin?tab=add', tab: 'add', icon: '✏️' },
  { name: 'Blog List', href: '/admin?tab=list', tab: 'list', icon: '📋' },
  { name: 'Comments', href: '/admin?tab=comments', tab: 'comments', icon: '💬' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const isActive = (tab: string) => {
    return currentTab === tab || (!currentTab && tab === 'dashboard');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto p-6 max-w-7xl">
        <div className="flex flex-row md:flex-row gap-2">
          {/* Sidebar */}
          <div className={`${isMobile ? 'w-16' : 'w-64 lg:w-72'} bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-200`}>
            {!isMobile && (
              <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>
              </div>
            )}
            <nav className="pb-6">
              <ul>
                {navItems.map((item) => (
                  <li key={item.tab} className={isMobile ? 'px-2 py-1' : 'px-4 py-1'}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${isMobile ? 'justify-center' : 'space-x-3'} py-3 px-4 rounded-lg transition-colors group ${isActive(item.tab)
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      title={isMobile ? item.name : ''}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!isMobile && <span className="whitespace-nowrap">{item.name}</span>}
                      {isMobile && (
                        <span className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}