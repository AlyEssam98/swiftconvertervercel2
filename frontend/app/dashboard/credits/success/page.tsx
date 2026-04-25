"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function CreditSuccessPage() {
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(null as number | null);
    const [newCreditsAdded, setNewCreditsAdded] = useState(null as number | null);
    const { refreshUser } = useAuth();

    useEffect(() => {
        const refreshCredits = async () => {
            try {
                // Step 1: Get the baseline credit balance BEFORE the webhook arrives
                let baselineCredits = 0;
                try {
                    const baselineResponse = await api.get('/api/v1/credits/balance');
                    baselineCredits = baselineResponse.data.availableCredits ?? 0;
                } catch {
                    // ignore baseline fetch failure, treat as 0
                }

                // Step 2: Poll until balance increases above baseline (webhook processed)
                // Up to 30 attempts with growing delays (~30 seconds total window)
                let attempts = 0;
                let currentCredits = baselineCredits;
                const MAX_ATTEMPTS = 30;

                while (attempts < MAX_ATTEMPTS) {
                    await new Promise((resolve) => setTimeout(resolve, 1000 + attempts * 500));

                    try {
                        await refreshUser();
                        const response = await api.get('/api/v1/credits/balance');
                        currentCredits = response.data.availableCredits ?? 0;

                        if (currentCredits > baselineCredits) {
                            // Webhook has been processed — credits increased
                            setCredits(currentCredits);
                            setNewCreditsAdded(currentCredits - baselineCredits);
                            break;
                        }
                    } catch {
                        // transient error, keep retrying
                    }

                    attempts++;
                }

                // Polling exhausted — show whatever the current balance is
                if (currentCredits <= baselineCredits) {
                    setCredits(currentCredits);
                    setNewCreditsAdded(null); // webhook may still be in flight
                }
            } catch (error) {
                console.error('Failed to refresh credits:', error);
            } finally {
                setLoading(false);
            }
        };
        refreshCredits();
    }, [refreshUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Processing your payment...</p>
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
                            <p>Your payment was received. Credits may take a moment to appear — please refresh your balance in a few seconds.</p>
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
