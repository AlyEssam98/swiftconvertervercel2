import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const DOMAIN = 'https://www.swiftmxbridge.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
