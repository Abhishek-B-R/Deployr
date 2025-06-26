import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function ProjectsListSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="w-20 h-6 bg-muted rounded animate-pulse" />
            <Separator orientation="vertical" className="h-6" />
            <div className="hidden md:flex items-center space-x-6">
              <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              <div className="w-20 h-4 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-muted rounded animate-pulse" />
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="w-32 h-8 bg-muted rounded animate-pulse" />
              <div className="w-64 h-5 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-32 h-10 bg-muted rounded animate-pulse" />
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-10 bg-muted rounded animate-pulse" />
            <div className="w-32 h-10 bg-muted rounded animate-pulse" />
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="w-32 h-6 bg-muted rounded" />
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-5 bg-muted rounded" />
                        <div className="w-12 h-5 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-muted rounded" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-10 bg-muted rounded" />
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded" />
                    <div className="w-24 h-4 bg-muted rounded" />
                    <div className="w-3 h-3 bg-muted rounded" />
                    <div className="w-12 h-4 bg-muted rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="text-center space-y-1">
                        <div className="w-8 h-4 bg-muted rounded mx-auto" />
                        <div className="w-12 h-3 bg-muted rounded mx-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
