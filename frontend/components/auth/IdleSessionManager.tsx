"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";

const DEFAULT_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

export function IdleSessionManager() {
    const { user, logout } = useAuth();
    const timeoutRef = useRef(null as ReturnType<typeof setTimeout> | null);

    useEffect(() => {
        if (!user) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            return;
        }

        const idleTimeoutMs = Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS ?? DEFAULT_IDLE_TIMEOUT_MS);
        const resetTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                logout();
            }, idleTimeoutMs);
        };

        const activityEvents: Array<keyof WindowEventMap> = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
        activityEvents.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));
        document.addEventListener("visibilitychange", resetTimer);
        resetTimer();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
            document.removeEventListener("visibilitychange", resetTimer);
        };
    }, [user, logout]);

    return null;
}
