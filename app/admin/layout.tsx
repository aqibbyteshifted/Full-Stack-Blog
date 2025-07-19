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
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg h-full min-h-screen">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>
            </div>
            <nav className="mt-6 pb-6">
              <ul>
                {navItems.map((item) => (
                  <li key={item.tab} className="px-6 py-3">
                    <Link 
                      href={item.href}
                      className={`flex items-center space-x-3 py-4 px-4 rounded-lg transition-colors ${
                        isActive(item.tab)
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}