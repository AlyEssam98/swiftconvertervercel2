"use client";

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { loadPendingCreditPurchase, clearPendingCreditPurchase } from '@/lib/creditPurchaseStorage';

export default function CreditSuccessPage() {
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(null as number | null);
    const [newCreditsAdded, setNewCreditsAdded] = useState(null as number | null);
    const [pending, setPending] = useState(false);
    const { refreshUser } = useAuth();

    const tryVerifyAndPoll = useCallback(async () => {
        setLoading(true);
        setPending(false);

        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');

        // Load the pre-purchase baseline saved before redirect
        const pendingPurchase = loadPendingCreditPurchase();
        const storedBaseline = pendingPurchase?.baselineBalance ?? 0;

        try {
            // Step 1: Call verify-purchase endpoint (proactively fulfills if webhook hasn't)
            if (sessionId) {
                try {
                    const verifyRes = await api.get('/api/v1/credits/verify-purchase', {
                        params: { session_id: sessionId }
                    });
                    if (verifyRes.data.fulfilled) {
                        const currentCredits = verifyRes.data.availableCredits ?? 0;
                        setCredits(currentCredits);
                        setNewCreditsAdded(currentCredits - storedBaseline);
                        await refreshUser();
                        clearPendingCreditPurchase();
                        setLoading(false);
                        return;
                    }
                } catch {
                    // verify endpoint failed, fall through to polling
                }
            }

            // Step 2: Poll balance against stored baseline (max 10 attempts, 2s each = 20s)
            const MAX_ATTEMPTS = 10;
            let currentCredits = storedBaseline;

            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                await new Promise((resolve) => setTimeout(resolve, 2000));

                try {
                    await refreshUser();
                    const response = await api.get('/api/v1/credits/balance');
                    currentCredits = response.data.availableCredits ?? 0;

                    if (currentCredits > storedBaseline) {
                        setCredits(currentCredits);
                        setNewCreditsAdded(currentCredits - storedBaseline);
                        clearPendingCreditPurchase();
                        setLoading(false);
                        return;
                    }
                } catch {
                    // transient error, keep retrying
                }
            }

            // Polling exhausted — show current balance with "still processing" message
            setCredits(currentCredits);
            setNewCreditsAdded(null);
            setPending(true);
        } catch (error) {
            console.error('Failed to verify purchase:', error);
            setCredits(storedBaseline);
            setNewCreditsAdded(null);
            setPending(true);
        } finally {
            setLoading(false);
        }
    }, [refreshUser]);

    useEffect(() => {
        tryVerifyAndPoll();
    }, [tryVerifyAndPoll]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Verifying your payment...</p>
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
                    <p className="text-gray-500 mb-6">Your payment was confirmed. Credits are being added to your account.</p>

                    {newCreditsAdded !== null && newCreditsAdded > 0 ? (
                        <div className="mb-6 space-y-3">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-700 font-medium mb-1">✅ Credits Added</p>
                                <p className="text-2xl font-bold text-green-700">+{newCreditsAdded} credits</p>
                            </div>
                            {credits !== null && (
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex items-center justify-center space-x-2">
                                        <CreditCard className="w-5 h-5 text-blue-600" />
                                        <span className="text-lg font-semibold text-gray-900">
                                            {credits} Total Available
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
                            <p className="font-medium mb-1">⏳ Credits are being processed</p>
                            <p>Your payment was received. Credits may take a moment to appear.</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={tryVerifyAndPoll}
                            >
                                Check Again
                            </Button>
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
