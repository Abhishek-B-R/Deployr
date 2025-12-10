import React from "react"

export default function DeployConfigSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Progress Steps Skeleton */}
      <div className="flex items-center space-x-4 mb-12">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-neo-black/20 rounded-full"></div>
          <div className="h-4 bg-neo-black/10 w-32"></div>
        </div>
        <div className="w-12 h-1 bg-neo-black/10"></div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-neo-black/20 rounded-full"></div>
          <div className="h-4 bg-neo-black/10 w-28"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="bg-white border-4 border-neo-black shadow-neo-sm h-48"></div>
          <div className="bg-white border-4 border-neo-black shadow-neo-sm h-64"></div>
        </div>

        {/* Main Configuration Form Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white border-4 border-neo-black shadow-neo-lg min-h-[600px] p-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="h-10 bg-neo-black/10 w-1/2 border-2 border-transparent"></div>
              <div className="h-6 bg-neo-black/5 w-3/4"></div>
            </div>
            
            <div className="h-1 bg-neo-black/10 w-full my-6"></div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-5 bg-neo-black/10 w-24"></div>
                <div className="h-12 bg-neo-black/5 border-2 border-neo-black/10"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-neo-black/10 w-32"></div>
                <div className="h-12 bg-neo-black/5 border-2 border-neo-black/10"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-neo-black/10 w-20"></div>
                <div className="h-12 bg-neo-black/5 border-2 border-neo-black/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}