// components/admin/Sidebar.tsx
import React from "react"   ;

const tabs = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Add blogs", key: "add" },
  { label: "Blog lists", key: "list" },
  { label: "Comments", key: "comments" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="bg-[#FFF8F0] h-full w-60 flex flex-col py-8 border-r border-gray-200">
      <div className="text-2xl font-bold text-black px-6 mb-8">Quickblog</div>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`text-left px-6 py-3 mb-2 rounded-l-full font-medium ${
            activeTab === tab.key
              ? "bg-red-500 text-white"
              : "text-black hover:bg-red-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}