"use client";

import { useState } from 'react';
import { mt103Mappings, FieldMapping } from '@/lib/fieldMappings';
import { ChevronRight, Code, Info, FileText } from 'lucide-react';
import Link from 'next/link';

export default function MappingViewer() {
  const [selectedTag, setSelectedTag] = useState<FieldMapping>(mt103Mappings[0]);

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Tag List */}
      <div className="lg:col-span-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">MT103 Fields</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {mt103Mappings.map((mapping) => (
            <button
              key={mapping.tag}
              onClick={() => setSelectedTag(mapping)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-0 ${
                selectedTag.tag === mapping.tag 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`font-mono font-bold ${selectedTag.tag === mapping.tag ? 'text-blue-600' : 'text-gray-400'}`}>
                  :{mapping.tag}:
                </span>
                <span className="text-sm font-medium truncate max-w-[150px]">{mapping.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${selectedTag.tag === mapping.tag ? 'text-blue-500' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Mapping Details */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                MT Tag {selectedTag.tag}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedTag.name}</h2>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-bold text-gray-900 mb-3">
                <Info className="w-4 h-4 mr-2 text-blue-500" />
                Mapping Logic
              </h4>
              <p className="text-gray-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                {selectedTag.description}
              </p>
            </div>

            <div>
              <h4 className="flex items-center text-sm font-bold text-gray-900 mb-3">
                <Code className="w-4 h-4 mr-2 text-blue-500" />
                ISO 20022 XML (MX) Path
              </h4>
              <code className="block bg-gray-900 text-blue-400 p-4 rounded-xl font-mono text-sm overflow-x-auto break-all">
                {selectedTag.mxPath}
              </code>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">MX Example Snippet</h4>
              <div className="relative group">
                <pre className="bg-gray-50 p-6 rounded-xl border border-gray-200 font-mono text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                  {selectedTag.example}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
          <h4 className="font-bold mb-2">Ready to automate this mapping?</h4>
          <p className="text-blue-100 text-sm mb-4">Our engine handles all these complexities natively, ensuring 100% compliance with CBPR+ rules.</p>
          <Link href="/auth/register" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
            Try Conversion Now
          </Link>
        </div>
      </div>
    </div>
  );
}
