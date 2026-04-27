"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function LemonSqueezyScript() {
    const isInitialized = useRef(false);

    const initLS = (source: string) => {
        // @ts-ignore
        if (window.LemonSqueezy && !isInitialized.current) {
            console.log(`Lemon Squeezy: Initializing from ${source}`);
            // @ts-ignore
            window.LemonSqueezy.Setup({
                eventHandler: (event: any) => {
                    console.log('Lemon Squeezy Global event:', event);
                    // Dispatch the event globally so other components can listen
                    window.dispatchEvent(new CustomEvent('LemonSqueezyEvent', { detail: event }));
                }
            });
            isInitialized.current = true;
            window.dispatchEvent(new Event('LemonSqueezyLoaded'));
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            if (window.LemonSqueezy) {
                initLS('useEffect');
            }
        }
    }, []);

    return (
        <Script
            src="https://app.lemonsqueezy.com/js/lemon.js"
            strategy="afterInteractive"
            onLoad={() => {
                initLS('onLoad');
            }}
        />
    );
}
