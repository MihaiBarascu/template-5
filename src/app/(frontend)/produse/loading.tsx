export default function Loading() {
  return (
    <div className="min-h-screen bg-theme-surface">
      <div className="container mx-auto px-4 py-4">
        <div className="h-6 w-24 bg-theme-light rounded animate-pulse" />
      </div>

      <div className="bg-theme-light py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-white/50 rounded animate-pulse mb-2" />
          <div className="h-6 w-96 bg-white/50 rounded animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-theme-light rounded-lg mb-3" />
              <div className="h-4 w-3/4 bg-theme-light rounded mb-2" />
              <div className="h-5 w-1/2 bg-theme-light rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
