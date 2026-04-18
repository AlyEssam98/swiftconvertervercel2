import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'SWIFT MT to MX Blog & Technical Guides | SwiftMX Bridge',
  description: 'Technical insights, ISO 20022 migration guides, and MT to MX mapping documentation for financial engineers.',
  keywords: ['SWIFT blog', 'ISO 20022 migration', 'MT to MX mapping', 'Fintech engineering'],
};

export default function BlogIndex() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="font-semibold text-gray-900">SwiftMX Bridge</span>
          </Link>
        </nav>
      </header>

      <div className="bg-white border-b border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Engineering <span className="text-blue-600">Insights</span>
            </h1>
            <p className="text-xl text-gray-600">
              Technical guides on ISO 20022 migration, CBPR+ compliance, and modernizing legacy payment systems.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  Read Article <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
