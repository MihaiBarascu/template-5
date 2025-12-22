export default function TeamMemberLoading() {
  return (
    <div className="min-h-screen bg-theme-light">
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb skeleton */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Image & Quick Info Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Image placeholder */}
              <div className="h-96 lg:h-[450px] bg-gray-200 animate-pulse" />

              <div className="p-6 space-y-4">
                {/* Name and role */}
                <div className="text-center space-y-2">
                  <div className="h-8 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Experience badge */}
                <div className="flex items-center justify-center gap-3 py-4 border-y border-gray-100">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Social media */}
                <div className="pt-4 flex justify-center gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bio & Details Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Bio Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Specializations Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-200 rounded-xl shadow-lg p-8 animate-pulse">
              <div className="h-8 w-2/3 bg-gray-300 rounded mb-4" />
              <div className="h-4 w-full bg-gray-300 rounded mb-6" />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-12 w-40 bg-gray-300 rounded-lg" />
                <div className="h-12 w-48 bg-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
