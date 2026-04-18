import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { getAllErrorCodes } from '@/lib/errorCodes';

const DOMAIN = 'https://www.swiftmxbridge.com';

const conversionPairs = [
  'mt103-to-pacs008',
  'mt202-to-pacs009',
  'mt940-to-camt053',
  'mt102-to-pacs008'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${DOMAIN}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${DOMAIN}/error-codes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/legal/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${DOMAIN}/legal/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${DOMAIN}/field-explorer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const errorRoutes: MetadataRoute.Sitemap = getAllErrorCodes().map((err) => ({
    url: `${DOMAIN}/error-codes/${err.code}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const dynamicRoutes: MetadataRoute.Sitemap = conversionPairs.map((pair) => ({
    url: `${DOMAIN}/convert/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...blogRoutes, ...errorRoutes, ...dynamicRoutes];
}
