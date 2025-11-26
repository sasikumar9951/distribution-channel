"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useState, useEffect } from "react"; // <-- Itha add pannunga (useState, useEffect)
import { useRouter } from "next/navigation"; // <-- Itha add pannunga (useRouter)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const router = useRouter(); // <-- Router hook-ah inga use pannunga
  const [isLoading, setIsLoading] = useState(true); // <-- Loading state add pannunga

  // --- ITHU THAN PUTHU AUTHENTICATION CHECK ---
  useEffect(() => {
    // Client-side la mattum localStorage-ah access pannurom
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Token illana, signin page ku poidu
      router.push('/signin');
    } else {
      // Token iruntha, loading ah stop pannitu page ah kaatu
      setIsLoading(false);
    }
  }, [router]);
  // ----------------------------------------------


  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  // Token check aagura varaikum, onnum kaatatha
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Token iruntha mattum, main layout ah kaatu
  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}