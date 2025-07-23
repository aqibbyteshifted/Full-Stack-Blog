"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import DashboardTab from "@/components/ui/admin/DashboardTab";
import AddBlogTab from "@/components/ui/admin/AddBlogTab";
import BlogListTab from "@/components/ui/admin/BlogListTab";
import CommentsTab from "@/components/ui/admin/CommentsTab";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tab || "dashboard");

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <main className="flex-1 p-4">
      {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "add" && <AddBlogTab />}
      {activeTab === "list" && <BlogListTab />}
      {activeTab === "comments" && <CommentsTab />}
    </main>
  );
}