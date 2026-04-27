"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        LemonSqueezy: {
            Setup: (options: {
                eventHandler: (event: any) => void;
            }) => void;
            Refresh: () => void;
            Url: {
                Open: (url: string) => void;
            };
        };
    }
}

export default function LemonSqueezyScript() {
    const isInitialized = useRef(false);

    const initLS = (source: string) => {
        if (typeof window !== 'undefined' && window.LemonSqueezy && !isInitialized.current) {
            console.log(`Lemon Squeezy: Initializing from ${source}`);
            
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
        if (typeof window === 'undefined') return;

        // Check immediately if script is already loaded (beforeInteractive)
        if (window.LemonSqueezy) {
            initLS('useEffect');
        }

        // Periodic check in case of slow loading or deferred execution
        let checks = 0;
        const interval = setInterval(() => {
            if (window.LemonSqueezy) {
                initLS('interval');
                clearInterval(interval);
            }
            if (++checks > 20) {
                clearInterval(interval);
                if (!window.LemonSqueezy) {
                    console.warn('Lemon Squeezy: Script failed to load after 10 seconds.');
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return null;
}
