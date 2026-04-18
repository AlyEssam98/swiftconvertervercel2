"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function ErrorCodeCTA() {
  const { user } = useAuth();

  return (
    <div className="bg-blue-50 rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-0">
        Stop dealing with manual MT validations.
      </h3>
      <p className="text-gray-600 mb-6">
        Use SwiftMX Bridge to instantly and accurately convert your legacy SWIFT
        MT messages into CBPR+ compliant ISO 20022 XML formats without any
        validation headaches.
      </p>
      <Link
        href={user ? "/dashboard/convert" : "/auth/register"}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        {user ? "Try the Converter Now" : "Try the Converter for Free"}
      </Link>
    </div>
  );
}
