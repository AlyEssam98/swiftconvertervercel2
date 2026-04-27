"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function LemonSqueezyScript() {
    return (
        <Script
            src="https://app.lemonsqueezy.com/js/lemon.js"
            strategy="afterInteractive"
            onLoad={() => {
                // @ts-ignore
                if (window.LemonSqueezy) {
                    // @ts-ignore
                    window.LemonSqueezy.Setup({
                        eventHandler: (event: any) => {
                            console.log('Lemon Squeezy Global event:', event);
                        }
                    });
                    // Dispatch custom event for components waiting for LS
                    window.dispatchEvent(new Event('LemonSqueezyLoaded'));
                }
            }}
        />
    );
}
