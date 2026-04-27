"use client";

import { useEffect, useRef } from "react";

export default function LemonSqueezyScript() {
    const isInitialized = useRef(false);

    const initLS = (source: string) => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.LemonSqueezy && !isInitialized.current) {
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
            // Check immediately
            // @ts-ignore
            if (window.LemonSqueezy) {
                initLS('useEffect');
            }

            // Also check periodically for a few seconds as a fallback
            let checks = 0;
            const interval = setInterval(() => {
                // @ts-ignore
                if (window.LemonSqueezy) {
                    initLS('interval');
                    clearInterval(interval);
                }
                if (++checks > 20) clearInterval(interval);
            }, 500);

            return () => clearInterval(interval);
        }
    }, []);

    return null;
}
