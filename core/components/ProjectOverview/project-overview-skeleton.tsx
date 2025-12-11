"use client"

import React from "react";
import NavBar from "@/components/NavBar";

export function ProjectOverviewSkeleton() {
  return (
    <div className="min-h-screen bg-neo-bg">
      <NavBar />

      <main className="container mx-auto py-12 px-4 md:px-10 pt-32">
        <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
          
          {/* Status Banner Skeleton */}
          <div className="w-full h-24 bg-neo-black/10 border-4 border-neo-black/20"></div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white border-4 border-neo-black/20 shadow-neo-sm"></div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="w-full h-16 bg-white border-4 border-neo-black/20 flex gap-1 p-1">
             <div className="flex-1 bg-neo-black/10"></div>
             <div className="flex-1 bg-transparent"></div>
             <div className="flex-1 bg-transparent"></div>
             <div className="flex-1 bg-transparent"></div>
          </div>

          {/* Content Skeleton */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-80 bg-white border-4 border-neo-black/20 shadow-neo-sm"></div>
            <div className="h-80 bg-white border-4 border-neo-black/20 shadow-neo-sm"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
