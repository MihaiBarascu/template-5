/**
 * Loading component for blog listing page
 */
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="bg-theme-dark py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 bg-white/20 rounded animate-pulse w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-white/10 rounded animate-pulse w-64 mx-auto"></div>
        </div>
      </div>

      {/* Blog grid skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-theme-surface rounded-[var(--radius-card)] overflow-hidden shadow-theme-card">
              <div className="h-48 bg-theme-light animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-theme-light rounded animate-pulse w-1/4"></div>
                <div className="h-6 bg-theme-light rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-theme-light rounded animate-pulse w-full"></div>
                <div className="h-4 bg-theme-light rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
