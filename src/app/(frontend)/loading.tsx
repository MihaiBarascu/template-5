/**
 * Loading component for Suspense boundary
 * Provides visual feedback while page content is loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Animated loading spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-theme-border rounded-full"></div>
          <div className="absolute inset-0 border-4 border-theme-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-theme-text-light text-sm">Se incarca...</p>
      </div>
    </div>
  )
}
