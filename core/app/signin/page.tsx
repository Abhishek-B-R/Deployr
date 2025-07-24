"use client"
import { Suspense } from "react"
import SignInForm from "@/components/signin-form"

function SignInPageSkeleton() {
  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-8 w-48 bg-muted rounded mx-auto animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded mx-auto animate-pulse" />
      </div>

      {/* Card Skeleton */}
      <div className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm rounded-lg p-6 space-y-6">
        <div className="space-y-1">
          <div className="h-6 w-32 bg-muted rounded mx-auto animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded mx-auto animate-pulse" />
        </div>

        {/* GitHub Button Skeleton */}
        <div className="h-12 w-full bg-muted rounded animate-pulse" />

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-muted" />
          </div>
          <div className="relative flex justify-center">
            <div className="h-4 w-24 bg-card rounded animate-pulse" />
          </div>
        </div>

        {/* Password Input Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-12 w-full bg-muted rounded animate-pulse" />
        </div>

        {/* Submit Button Skeleton */}
        <div className="h-12 w-full bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
      <Suspense fallback={<SignInPageSkeleton />}>
        <SignInForm />
      </Suspense>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>
    </div>
  )
}
