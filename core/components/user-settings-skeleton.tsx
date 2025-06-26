import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function UserSettingsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-8 bg-muted rounded animate-pulse" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-muted rounded animate-pulse" />
              <div className="w-16 h-6 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="w-9 h-9 bg-muted rounded animate-pulse" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Overview Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-muted rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="w-32 h-6 bg-muted rounded animate-pulse" />
                  <div className="w-48 h-4 bg-muted rounded animate-pulse" />
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                    <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Skeleton */}
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                    <div className="space-y-1">
                      <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                      <div className="w-8 h-6 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Settings Cards Skeleton */}
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                  <div className="w-32 h-6 bg-muted rounded animate-pulse" />
                </div>
                <div className="w-64 h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full h-10 bg-muted rounded animate-pulse" />
                  <div className="w-full h-10 bg-muted rounded animate-pulse" />
                  <div className="w-24 h-10 bg-muted rounded animate-pulse ml-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
