import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { getErrorCode, getAllErrorCodes } from '@/lib/errorCodes';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const errorObj = getErrorCode(resolvedParams.code);
  
  if (!errorObj) {
    return {
      title: 'Error Code Not Found | SwiftMX Bridge',
    };
  }

  return {
    title: `${errorObj.title} | SWIFT Error Fix`,
    description: errorObj.description,
  };
}

export async function generateStaticParams() {
  const errors = getAllErrorCodes();
  return errors.map((err) => ({
    code: err.code,
  }));
}

export default async function ErrorCodePage({ params }: Props) {
  const resolvedParams = await params;
  const errorObj = getErrorCode(resolvedParams.code);

  if (!errorObj) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/error-codes" className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Error Codes</span>
          </Link>
        </nav>
      </header>

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <header className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-bold mb-6">
            Error Code {errorObj.code.toUpperCase()}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {errorObj.title}
          </h1>
        </header>

        <div className="prose prose-lg prose-red max-w-none">
          <div className="bg-gray-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
            <h3 className="flex items-center text-red-800 font-bold text-xl mt-0 mb-3">
              <AlertCircle className="w-5 h-5 mr-2" />
              Problem Description
            </h3>
            <p className="text-gray-700 m-0">
              {errorObj.description}
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-12">
            <h3 className="flex items-center text-green-800 font-bold text-xl mt-0 mb-3">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              How to Fix It
            </h3>
            <p className="text-gray-700 m-0">
              {errorObj.fix}
            </p>
          </div>

          <hr className="my-12 border-gray-200" />

          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-0">Stop dealing with manual MT validations.</h3>
            <p className="text-gray-600 mb-6">
              Use SwiftMX Bridge to instantly and accurately convert your legacy SWIFT MT messages into CBPR+ compliant ISO 20022 XML formats without any validation headaches.
            </p>
            <Link href="/auth/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Try the Converter for Free
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
