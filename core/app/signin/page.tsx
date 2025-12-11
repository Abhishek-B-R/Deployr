"use client";

import { Suspense } from "react";
import SignInForm from "@/components/signin-form";
import NavBar from "@/components/NavBar";
import { Sparkles } from "lucide-react";

function SignInPageSkeleton() {
  return (
    <div className="w-full max-w-md bg-white border-4 border-neo-black p-8 shadow-neo-lg animate-pulse h-[500px]">
       <div className="h-8 bg-gray-200 w-3/4 mx-auto mb-8"></div>
       <div className="space-y-4">
           <div className="h-12 bg-gray-200 w-full"></div>
           <div className="h-12 bg-gray-200 w-full"></div>
           <div className="h-12 bg-gray-200 w-full"></div>
       </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-neo-bg font-sans text-neo-black flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden pt-20">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-neo-yellow border-4 border-black rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-neo-blue border-4 border-black rotate-12"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-neo-pink border-4 border-black rotate-45"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
            {/* Header Above Card */}
            <div className="text-center mb-8 relative">
                <div className="inline-block relative">
                    <h1 className="text-5xl font-black uppercase tracking-tighter relative z-10">
                        Welcome Back
                    </h1>
                    <Sparkles className="absolute -top-6 -right-8 w-10 h-10 text-neo-yellow fill-current animate-spin-slow" />
                </div>
                <p className="text-lg font-bold text-gray-500 mt-2">Access your deployment dashboard.</p>
            </div>

            <Suspense fallback={<SignInPageSkeleton />}>
                <SignInForm />
            </Suspense>

            <p className="text-center mt-8 font-mono text-sm font-bold text-gray-400">
                SECURE_CONNECTION_ESTABLISHED
            </p>
        </div>
      </main>
    </div>
  );
}
