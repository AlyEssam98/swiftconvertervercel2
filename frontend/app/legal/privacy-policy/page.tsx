import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SwiftMX Bridge',
  description: 'Privacy policy detailing our ephemeral data processing guarantees and data handling practices.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Home</span>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-indigo max-w-none text-gray-600">
            <p className="text-sm font-medium text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p>
              SwiftMX Bridge ("we", "our", or "us") respects your privacy and is committed to protecting your personal and financial data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
            </p>

            <h2 className="text-xl font-bold text-indigo-700 mt-8 mb-4">2. Ephemeral Processing of Financial Data (Our Guarantee)</h2>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 my-6">
              <p className="text-indigo-900 font-medium m-0">
                SwiftMX Bridge operates on an "Ephemeral Processing" architecture. 
              </p>
              <ul className="text-indigo-800 mt-4 mb-0">
                <li>We <strong>do not</strong> permanently store the contents of your SWIFT MT or MX messages.</li>
                <li>Financial payloads are processed entirely in-memory for the duration of the translation request.</li>
                <li>Once the converted output is returned to your client, the memory buffers are immediately wiped.</li>
                <li>We do not log, harvest, or retain any Personally Identifiable Information (PII) or financial details (such as account balances, names, or addresses) contained within the payloads you submit for conversion.</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Information We Collect</h2>
            <p>While we do not store your financial payloads, we do collect limited information necessary to operate the Service:</p>
            <ul>
              <li><strong>Account Information:</strong> When you register, we collect your email address and password (securely hashed) to manage your account and credits.</li>
              <li><strong>Usage Metrics:</strong> We log the metadata of your conversions (e.g., timestamp, format type translated, error codes returned, and credit deductions) for billing and analytics purposes. We do not log the content.</li>
              <li><strong>Cookies and Tracking:</strong> We use standard cookies to maintain your authenticated session.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. How We Use Your Information</h2>
            <p>We use the collected metadata and account information to:</p>
            <ul>
              <li>Provide, maintain, and secure the Service.</li>
              <li>Process transactions and manage your conversion credits.</li>
              <li>Send administrative emails (e.g., password resets, billing alerts).</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures, including TLS 1.3 encryption in transit, to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Third-Party Services</h2>
            <p>
              We may use third-party service providers (e.g., payment processors, hosting providers) to facilitate our Service. These third parties have access to your Account Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through the Contact page in your dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
