import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightLeft } from 'lucide-react';
import MappingViewer from '@/components/conversion/MappingViewer';

export const metadata: Metadata = {
  title: 'SWIFT MT to MX Mapping Explorer | Interactive ISO 20022 Guide',
  description: 'Interactive tool for mapping SWIFT MT103 tags to ISO 20022 MX paths. Visual mapping, CBPR+ rules, and XML examples for financial developers.',
  keywords: ['SWIFT mapping guide', 'MT103 to pacs.008 mapping', 'ISO 20022 field explorer', 'CBPR+ mapping rules'],
};

export default function FieldExplorerPage() {
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
              Field <span className="text-blue-600">Explorer</span>
            </h1>
            <p className="text-xl text-gray-600">
              Interactive mapping guide for SWIFT MT and ISO 20022 transformation. 
              Visualize exactly how legacy tags map to the new standard.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <MappingViewer />
        </div>
      </div>
    </div>
  );
}
