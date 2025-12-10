import React from "react";
import NavBar from "@/components/NavBar";

export function ProjectsListSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="container mx-auto px-4 md:px-10 py-12 pt-32">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 animate-pulse">
          <div className="space-y-4">
            <div className="h-12 bg-neo-black/10 w-64 border-2 border-transparent"></div>
            <div className="h-6 bg-neo-black/5 w-96"></div>
          </div>
          <div className="h-12 bg-neo-black/10 w-48 border-2 border-transparent"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-pulse">
          <div className="flex-1 h-12 bg-white border-4 border-neo-black/20"></div>
          <div className="w-40 h-12 bg-white border-4 border-neo-black/20"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border-4 border-neo-black/20 h-64 p-6 relative overflow-hidden">
               {/* Decorative Pulse */}
               <div className="absolute top-0 left-0 w-full h-2 bg-neo-black/10 animate-pulse"></div>
               
               <div className="flex justify-between items-start mb-6">
                 <div className="h-8 w-1/2 bg-neo-black/10"></div>
                 <div className="h-8 w-8 rounded-full bg-neo-black/10"></div>
               </div>
               
               <div className="space-y-3 mb-8">
                 <div className="h-4 w-full bg-neo-black/5"></div>
                 <div className="h-4 w-2/3 bg-neo-black/5"></div>
               </div>
               
               <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                 <div className="h-6 w-20 bg-neo-black/10"></div>
                 <div className="h-6 w-20 bg-neo-black/10"></div>
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}