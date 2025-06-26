import { Card, CardContent } from "@/components/ui/card"

export default function DeployConfigSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps Skeleton */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-muted rounded-full animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="w-8 h-px bg-muted animate-pulse"></div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-muted rounded-full animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-28 animate-pulse"></div>
        </div>
        <div className="w-8 h-px bg-muted animate-pulse"></div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-muted rounded-full animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Framework Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-muted rounded w-24"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </CardContent>
          </Card>

          {/* Repository Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-muted rounded w-20"></div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-40"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-8"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Configuration Form Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded w-48"></div>
                  <div className="h-4 bg-muted rounded w-80"></div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-28"></div>
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-64"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-56"></div>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-muted rounded"></div>

                {/* Build Settings Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-5 bg-muted rounded w-48"></div>
                      <div className="h-4 bg-muted rounded w-64"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-11 h-6 bg-muted rounded-full"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-muted rounded"></div>

                {/* Environment Variables Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-5 bg-muted rounded w-40"></div>
                      <div className="h-4 bg-muted rounded w-52"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Deploy Button Skeleton */}
            <div className="px-6 py-4 bg-muted/50 rounded-b-lg">
              <div className="h-12 bg-muted rounded animate-pulse"></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
