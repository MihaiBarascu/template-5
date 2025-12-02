const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://localhost:3000'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin/*',
    '/api/*',
    '/next/*',
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/services-sitemap.xml',
    '/team-sitemap.xml',
    '/portfolio-sitemap.xml',
    '/products-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/api/*', '/next/*'],
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/services-sitemap.xml`,
    ],
  },
  additionalPaths: async (config) => {
    const result = []

    // Homepage with highest priority
    result.push({
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    })

    // Main pages
    result.push({
      loc: '/servicii',
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    })

    result.push({
      loc: '/despre',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    })

    result.push({
      loc: '/contact',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    })

    return result
  },
}
