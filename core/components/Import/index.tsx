"use client";
import { Suspense } from "react";
import { DeployConfig } from "./deploy-config";
import { SessionProvider } from "next-auth/react";
import NavBar from "../NavBar";
import Footer from "../Footer";
import DeployConfigSkeleton from "./deploy-config-skeleton";

export default function ImportPage() {
  return (
    <div className="min-h-screen md:px-16 min-w-full bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="container py-12 md:pl-30">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">
            You&apos;re almost done.
          </h1>
          <p className="text-lg text-muted-foreground text-center">
            Please follow the steps to configure your Project and deploy it.
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
