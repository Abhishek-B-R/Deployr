"use client"
import { Suspense } from "react"
import { DeployConfig } from "./deploy-config"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { SessionProvider } from "next-auth/react"

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold">Deployr</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">You&apos;re almost done.</h1>
          <p className="text-lg text-muted-foreground">
            Please follow the steps to configure your Project and deploy it.
          </p>
        </div>

        <Suspense fallback={<DeployConfigSkeleton />}>
            <SessionProvider>
                <DeployConfig />
            </SessionProvider>
        </Suspense>
      </main>
    </div>
  )
}

function DeployConfigSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
