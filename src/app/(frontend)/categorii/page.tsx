import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Categorii Produse | EcoShop',
  description: 'Exploreaza toate categoriile de produse naturale si organice',
}

export default async function CategoriesPage() {
  const payload = await getPayload({ config: configPromise })

  // Get all product categories
  const categories = await payload.find({
    collection: 'product-categories',
    limit: 100,
    sort: 'order',
  })

  // Get product count for each category
  const categoriesWithCount = await Promise.all(
    categories.docs.map(async (category) => {
      const products = await payload.find({
        collection: 'products',
        where: {
          category: {
            equals: category.id,
          },
        },
        limit: 0,
      })
      return {
        ...category,
        productCount: products.totalDocs,
      }
    })
  )

  return (
    <main className="py-8">
      {/* Hero */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Categorii Produse
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exploreaza gama noastra de produse naturale organizate pe categorii
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        {categoriesWithCount.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesWithCount.map((category: any) => (
              <Link
                key={category.id}
                href={`/categorii/${category.slug}`}
                className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-theme-primary hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-theme-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-theme-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-theme-primary transition-colors">
                  {category.title}
                </h2>

                {category.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} {category.productCount === 1 ? 'produs' : 'produse'}
                  </span>
                  <span className="text-theme-primary group-hover:translate-x-1 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">Nu exista categorii momentan.</p>
          </div>
        )}
      </div>
    </main>
  )
}
