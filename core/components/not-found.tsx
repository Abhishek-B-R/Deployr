"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { NeoButton, NeoCard } from "@/components/neo-ui";
import NavBar from "@/components/NavBar";
import Footer from "./Footer";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neo-bg font-sans text-neo-black overflow-hidden flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center relative p-4 pt-20">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Floating Elements */}
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-10 md:left-20 w-24 h-24 border-4 border-neo-black bg-neo-yellow shadow-neo-lg z-0 hidden md:block"
        />
        <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-10 md:right-20 w-32 h-32 border-4 border-neo-black bg-neo-blue rounded-full z-0 hidden md:block"
        />

        <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
            
            {/* 404 Display */}
            <div className="relative inline-block">
                 <motion.h1 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-9xl md:text-[12rem] font-black leading-none select-none drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] text-white"
                    style={{ WebkitTextStroke: '4px #1A1A1A' }}
                 >
                    404
                 </motion.h1>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neo-red w-[110%] h-4 rotate-12"></div>
                 <div className="absolute -top-6 -right-6 bg-neo-yellow text-neo-black border-4 border-neo-black px-4 py-1 font-bold text-xl shadow-neo transform rotate-12">
                    MISSING
                 </div>
            </div>

            {/* Message Card */}
            <NeoCard className="bg-white max-w-2xl mx-auto transform -rotate-1">
                <div className="flex items-center justify-center gap-3 mb-4 text-red-600">
                    <AlertTriangle className="w-8 h-8" strokeWidth={3} />
                    <h2 className="text-3xl font-black uppercase">Page Not Found</h2>
                </div>
                <p className="text-xl font-medium text-gray-600 mb-8 border-y-2 border-dashed border-gray-300 py-6">
                    The requested URL was not found on this server. <br/>
                    It might have been moved, deleted, or never existed in this timeline.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <NeoButton 
                        size="default" 
                        variant="primary"
                        onClick={() => router.push("/")}
                        className="w-full sm:w-auto"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Return Home
                    </NeoButton>
                    <NeoButton 
                        size="default" 
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </NeoButton>
                </div>
            </NeoCard>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
