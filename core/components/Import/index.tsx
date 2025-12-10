"use client";
import { Suspense } from "react";
import { DeployConfig } from "@/components/Import/deploy-config";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DeployConfigSkeleton from "@/components/Import/deploy-config-skeleton";

export default function ImportPage() {
  return (
    <div className="min-h-screen w-full bg-neo-bg font-sans text-neo-black">
      <NavBar />
      <main className="container mx-auto py-12 px-4 md:px-6 pt-32 min-h-screen">
        <div className="mb-12 text-center">
            <h1 className="text-5xl font-black mb-4 uppercase leading-none">
                Almost <span className="text-transparent" style={{ WebkitTextStroke: '2px #1A1A1A' }}>There</span>
            </h1>
            <p className="text-xl font-medium text-gray-600">
                Configure your build settings below.
            </p>
        </div>

        <Suspense fallback={<DeployConfigSkeleton />}>
          <SessionProvider>
            <DeployConfig />
          </SessionProvider>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}