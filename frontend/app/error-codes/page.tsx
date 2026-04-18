import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightLeft, AlertTriangle, ArrowRight } from 'lucide-react';
import { getAllErrorCodes } from '@/lib/errorCodes';

export const metadata: Metadata = {
  title: 'SWIFT Error Codes Database | SwiftMX Bridge',
  description: 'Search and resolve common SWIFT MT and MX validation error codes like T64, U03, and C03.',
  keywords: ['SWIFT error codes', 'T64 error', 'U03 error', 'ISO 20022 validation errors'],
};

export default function ErrorCodesIndex() {
  const errors = getAllErrorCodes();

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
              SWIFT <span className="text-red-600">Error Codes</span> Database
            </h1>
            <p className="text-xl text-gray-600">
              Quickly diagnose and fix SWIFT MT validation errors and ISO 20022 NACKs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid gap-6">
          {errors.map((err) => (
            <Link key={err.code} href={`/error-codes/${err.code}`}>
              <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition-all cursor-pointer group flex items-start space-x-4">
                <div className="mt-1 bg-red-100 p-2 rounded-lg text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {err.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2">
                    {err.description}
                  </p>
                  <div className="mt-4 flex items-center text-red-600 font-medium text-sm">
                    View Solution <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
