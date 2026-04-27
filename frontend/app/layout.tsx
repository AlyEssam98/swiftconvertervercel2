import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { IdleSessionManager } from "@/components/auth/IdleSessionManager";


const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.swiftmxbridge.com"),
    verification: {
        google: "qW53Zl5B7Ub3b-veOhLbV1wrUYp0TJ7cGmDR9Tba-Kg",
    },
    title: {
        default: "SWIFT MT to MX Converter | ISO 20022 Migration Bridge",
        template: "%s | SwiftMX Bridge"
    },
    description: "Instantly convert SWIFT MT103, MT202, & MT940 to ISO 20022 MX (pacs, camt). Bank-grade security, CBPR+ compliant, and API-ready. Start for free.",
    keywords: [
        "SWIFT MT to MX converter",
        "ISO 20022 message converter",
        "MT103 to pacs.008 converter",
        "MT202 to pacs.009 generator",
        "MT940 to camt.053 conversion",
        "Online SWIFT message translator",
        "CBPR+ conversion tool",
        "ISO 20022 validator online",
        "SWIFT MX bridge SaaS",
        "Bank-grade SWIFT converter"
    ],
    authors: [{ name: "SwiftMX Bridge" }],
    creator: "SwiftMX Bridge",
    publisher: "SwiftMX Bridge",
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: '/favicon.svg',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.swiftmxbridge.com",
        siteName: "SwiftMX Bridge",
        title: "SWIFT MT to MX Converter | ISO 20022 Migration Bridge",
        description: "Instantly convert SWIFT MT103, MT202, & MT940 to ISO 20022 MX (pacs, camt). Bank-grade security, CBPR+ compliant, and API-ready. Start for free.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "SWIFT MT to MX Converter",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "SWIFT MT to MX Converter | ISO 20022 Migration Bridge",
        description: "Instantly convert SWIFT MT103, MT202, & MT940 to ISO 20022 MX (pacs, camt). Bank-grade security, CBPR+ compliant, and API-ready. Start for free.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "https://www.swiftmxbridge.com",
    },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body className="min-h-screen antialiased transition-colors duration-300">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <IdleSessionManager />
                        {children}
                        <Toaster />
                        {/* @ts-ignore */}
                        <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
