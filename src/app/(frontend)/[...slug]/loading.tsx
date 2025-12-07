/**
 * Loading component for dynamic pages Suspense boundary
 */
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-theme-light h-[400px] animate-pulse"></div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 bg-theme-light rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-full"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-4/6"></div>
        </div>
      </div>
    </div>
  )
}
