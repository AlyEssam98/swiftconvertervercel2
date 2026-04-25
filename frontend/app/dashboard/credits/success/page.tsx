"use client";

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2, CreditCard, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function CreditSuccessPage() {
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(null as number | null);
    const [newCreditsAdded, setNewCreditsAdded] = useState(null as number | null);
    const [error, setError] = useState(null as string | null);
    const { refreshUser } = useAuth();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const processPayment = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const urlCheckoutId = urlParams.get('session_id');
            const storedCheckoutId = sessionStorage.getItem('pendingCheckoutId');
            const checkoutId = urlCheckoutId || storedCheckoutId;

            if (!checkoutId) {
                setError('No checkout session found. Please check your credits page.');
                setLoading(false);
                return;
            }

            try {
                // --- PRIMARY PATH: Proactive verification ---
                // Call backend to verify checkout status with Lemon Squeezy and fulfill credits
                const verifyResponse = await api.post('/api/v1/credits/purchase/verify', {
                    checkoutId
                });

                const balance = verifyResponse.data;
                const currentCredits = balance?.availableCredits ?? 0;
                setCredits(currentCredits);

                // Determine if this was a new fulfillment by checking if we had a stored baseline
                // The backend handles idempotency, so this will always return the true current balance
                setNewCreditsAdded(null); // We show the total, backend is source of truth

                await refreshUser();
                setLoading(false);
                return;
            } catch (verifyErr: any) {
                console.warn('Proactive verification failed or still pending, falling back to polling:', verifyErr);
                // Fallback to polling if proactive verification returns non-2xx
            }

            // --- FALLBACK PATH: Poll for credit balance with hard timeout ---
            let baselineCredits = 0;
            try {
                const baselineResponse = await api.get('/api/v1/credits/balance');
                baselineCredits = baselineResponse.data?.availableCredits ?? 0;
            } catch {
                /* ignore */
            }

            let currentCredits = baselineCredits;
            const MAX_ATTEMPTS = 15;
            let attempts = 0;

            while (attempts < MAX_ATTEMPTS) {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                try {
                    await refreshUser();
                    const response = await api.get('/api/v1/credits/balance');
                    currentCredits = response.data?.availableCredits ?? 0;

                    if (currentCredits > baselineCredits) {
                        setCredits(currentCredits);
                        setNewCreditsAdded(currentCredits - baselineCredits);
                        setLoading(false);
                        return;
                    }
                } catch {
                    // transient error, keep retrying
                }
                attempts++;
            }

            // Polling exhausted
            setCredits(currentCredits);
            setNewCreditsAdded(null);
            setLoading(false);
        };

        processPayment();
    }, [refreshUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Processing your payment...</p>
                    <p className="text-xs text-gray-400 mt-2">This may take a few seconds</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-8">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500 mb-6">
                        {error ? error : "Your payment was confirmed. Credits have been added to your account."}
                    </p>

                    {!error && credits !== null && (
                        <div className="mb-6 space-y-3">
                            {newCreditsAdded !== null && newCreditsAdded > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-green-700 font-medium mb-1">✅ Credits Added</p>
                                    <p className="text-2xl font-bold text-green-700">+{newCreditsAdded} credits</p>
                                </div>
                            )}
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center justify-center space-x-2">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    <span className="text-lg font-semibold text-gray-900">
                                        {credits} Total Available
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800 mb-2">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/dashboard" className="flex-1">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Start Converting
                            </Button>
                        </Link>
                        <Link href="/dashboard/credits" className="flex-1">
                            <Button variant="outline" className="w-full">
                                View Credits <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
