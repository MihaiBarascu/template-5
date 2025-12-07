/**
 * Loading component for blog post detail page
 */
export default function Loading() {
  return (
    <article className="min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-theme-dark py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="h-4 bg-white/20 rounded animate-pulse w-24 mx-auto"></div>
            <div className="h-12 bg-white/20 rounded animate-pulse w-full"></div>
            <div className="h-12 bg-white/20 rounded animate-pulse w-3/4 mx-auto"></div>
            <div className="h-4 bg-white/10 rounded animate-pulse w-48 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Featured image skeleton */}
      <div className="container mx-auto px-4 -mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-theme-light rounded-[var(--radius-card)] animate-pulse"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-4 bg-theme-light rounded animate-pulse w-full"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-full"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-full"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-4/6"></div>
          <div className="h-8 bg-theme-light rounded animate-pulse w-1/3 mt-8"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-full"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-full"></div>
          <div className="h-4 bg-theme-light rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    </article>
  )
}
