
import React from "react";
import NavBar from "@/components/NavBar";

export function UserSettingsSkeleton() {
  return (
    <div className="min-h-screen bg-neo-bg">
      <NavBar />
      <main className="container mx-auto px-4 md:px-10 py-12 pt-32 max-w-5xl animate-pulse">
        
        {/* Header Title Skeleton */}
        <div className="mb-12 space-y-2">
           <div className="h-16 w-64 bg-neo-black/10 border-4 border-transparent"></div>
           <div className="h-16 w-48 bg-neo-black/10 border-4 border-transparent"></div>
        </div>

        <div className="space-y-12">
           {/* Profile Card Skeleton */}
           <div className="bg-white border-4 border-neo-black/20 h-64 w-full"></div>
           
           {/* Form Card Skeleton */}
           <div className="bg-white border-4 border-neo-black/20 h-96 w-full p-8 space-y-8">
               <div className="h-10 w-1/3 bg-neo-black/10"></div>
               <div className="grid grid-cols-2 gap-8">
                   <div className="h-12 w-full bg-neo-black/5"></div>
                   <div className="h-12 w-full bg-neo-black/5"></div>
               </div>
           </div>

           {/* Other Cards Skeleton */}
           <div className="bg-white border-4 border-neo-black/20 h-48 w-full"></div>
        </div>
      </main>
    </div>
  );
}
