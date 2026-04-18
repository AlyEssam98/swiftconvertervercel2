import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightLeft, FileCode2, CheckCircle } from 'lucide-react';
import ConversionTool from '@/components/conversion/ConversionTool';

interface Props {
  params: Promise<{ slug: string }>;
}

const conversionData: Record<string, { title: string, desc: string, mtType: string }> = {
  'mt103-to-pacs008': {
    title: 'MT103 to pacs.008',
    desc: 'Convert SWIFT MT103 (Customer Credit Transfer) to ISO 20022 pacs.008 format for CBPR+ compliance.',
    mtType: 'MT103'
  },
  'mt202-to-pacs009': {
    title: 'MT202 to pacs.009',
    desc: 'Convert SWIFT MT202 (Financial Institution Transfer) to ISO 20022 pacs.009 format.',
    mtType: 'MT202'
  },
  'mt940-to-camt053': {
    title: 'MT940 to camt.053',
    desc: 'Convert SWIFT MT940 (Customer Statement Message) to ISO 20022 camt.053 format.',
    mtType: 'MT940'
  },
  'mt102-to-pacs008': {
    title: 'MT102 to pacs.008',
    desc: 'Convert SWIFT MT102 (Multiple Customer Credit Transfer) to ISO 20022 pacs.008 format.',
    mtType: 'MT102'
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const data = conversionData[slug];
  
  if (!data) {
    return {
      title: 'SWIFT Message Converter',
      description: 'Convert SWIFT MT messages to ISO 20022 MX format.'
    };
  }

  return {
    title: `${data.title} Converter & Mapping Tool | SwiftMX Bridge`,
    description: `Instantly ${data.desc.toLowerCase()} Free online mapping and validation tool.`,
    keywords: [
      `${data.title} converter`,
      `${data.title} mapping`,
      `convert ${slug.replace('-to-', ' to ')}`,
      `ISO 20022 ${data.title.split(' to ')[1]}`
    ]
  };
}

export default async function ConversionPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const data = conversionData[slug] || {
    title: 'SWIFT MT to MX',
    desc: 'Convert legacy SWIFT messages to modern ISO 20022 formats.',
    mtType: 'MT103'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="font-semibold text-gray-900">SwiftMX Bridge</span>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.title} Converter
            </h1>
            <p className="text-lg text-gray-600">
              {data.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Tool Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
               <div className="flex items-center space-x-2 text-gray-700">
                   <FileCode2 className="w-5 h-5 text-blue-600" />
                   <span className="font-medium">Live Conversion</span>
               </div>
               <span className="text-sm text-gray-500 flex items-center">
                   <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> API Ready
               </span>
            </div>
            <div className="p-6">
              <ConversionTool />
            </div>
          </div>
          
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Mapping: {data.title}</h2>
             <p className="text-gray-600 mb-4">
               When migrating from legacy SWIFT FIN networks to the modern ISO 20022 XML standard, understanding the exact field mappings is critical to avoid payment rejections (NACKs).
             </p>
             <p className="text-gray-600">
               Our engine translates {data.mtType} fields into their corresponding XML elements while validating against official ISO schemas. SwiftMX Bridge guarantees 100% CBPR+ compliance for your cross-border payments.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
