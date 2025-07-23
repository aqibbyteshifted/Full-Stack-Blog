"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const navItems = [
  { name: 'Dashboard', href: '/admin', tab: 'dashboard', icon: '📊' },
  { name: 'Add Blog', href: '/admin?tab=add', tab: 'add', icon: '✏️' },
  { name: 'Blog List', href: '/admin?tab=list', tab: 'list', icon: '📋' },
  { name: 'Comments', href: '/admin?tab=comments', tab: 'comments', icon: '💬' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const isActive = (tab: string) => {
    return currentTab === tab || (!currentTab && tab === 'dashboard');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 lg:w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>
            </div>
            <nav className="pb-6">
              <ul>
                {navItems.map((item) => (
                  <li key={item.tab} className="px-4 py-1">
                    <Link 
                      href={item.href}
                      className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                        isActive(item.tab)
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}