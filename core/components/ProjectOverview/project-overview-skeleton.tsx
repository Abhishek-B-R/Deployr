import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProjectOverviewSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="w-20 h-6 bg-muted rounded animate-pulse" />
            <div className="w-px h-6 bg-border" />
            <div className="w-32 h-6 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-9 bg-muted rounded animate-pulse" />
            <div className="w-24 h-9 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-2">
                    <div className="w-5 h-5 bg-muted rounded" />
                    <div className="w-16 h-4 bg-muted rounded" />
                    <div className="w-24 h-4 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <div className="w-full h-10 bg-muted rounded animate-pulse" />
            <div className="grid gap-6 lg:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="w-32 h-6 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse space-y-4">
                      <div className="w-full h-4 bg-muted rounded" />
                      <div className="w-3/4 h-4 bg-muted rounded" />
                      <div className="w-1/2 h-4 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
