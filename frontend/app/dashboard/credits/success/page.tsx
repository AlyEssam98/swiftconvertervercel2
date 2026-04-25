"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2, CreditCard, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { clearPendingCreditPurchase, loadPendingCreditPurchase } from "@/lib/creditPurchaseStorage";

const INITIAL_SETTLE_DELAY_MS = 500; // Minimal initial delay
const POLL_INTERVAL_MS = 1500;     // Faster polling (every 1.5s)
const MAX_POLL_ATTEMPTS = 20;      // 30 seconds total

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export default function CreditSuccessPage() {
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(null as number | null);
    const [newCreditsAdded, setNewCreditsAdded] = useState(null as number | null);
    const [statusMessage, setStatusMessage] = useState("Confirming your payment...");
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const { refreshUser } = useAuth();

    useEffect(() => {
        let isCancelled = false;

        const fetchCurrentBalance = async (): Promise<number | null> => {
            try {
                // Refresh auth context to ensure profile is up to date
                await refreshUser();
                const response = await api.get(`/api/v1/credits/balance?_t=${new Date().getTime()}`) as { data: { availableCredits: number } };
                return response.data.availableCredits ?? 0;
            } catch (error) {
                console.error("Error fetching balance:", error);
                return null;
            }
        };

        const finalizePurchaseState = async () => {
            const pendingPurchase = loadPendingCreditPurchase();

            if (!pendingPurchase) {
                // If no pending purchase found, just show current balance
                const currentBalance = await fetchCurrentBalance();
                if (isCancelled) return;

                setCredits(currentBalance);
                setNewCreditsAdded(null);
                setPaymentConfirmed(true);
                setStatusMessage("Your payment was confirmed.");
                setLoading(false);
                return;
            }

            const expectedBalance = pendingPurchase.baselineBalance + pendingPurchase.credits;
            setStatusMessage(`Waiting for +${pendingPurchase.credits} credits to sync...`);

            // Initial wait to allow webhook to potentially arrive
            await wait(INITIAL_SETTLE_DELAY_MS);

            let latestBalance = pendingPurchase.baselineBalance;

            for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
                if (isCancelled) return;

                const currentBalance = await fetchCurrentBalance();
                if (currentBalance !== null) {
                    latestBalance = currentBalance;
                }

                if (latestBalance >= expectedBalance) {
                    if (isCancelled) return;
                    
                    setCredits(latestBalance);
                    setNewCreditsAdded(pendingPurchase.credits);
                    setPaymentConfirmed(true);
                    setStatusMessage("Your credits were added successfully!");
                    clearPendingCreditPurchase();
                    setLoading(false);
                    return;
                }

                if (attempt < MAX_POLL_ATTEMPTS - 1) {
                    await wait(POLL_INTERVAL_MS);
                }
            }

            // If we get here, polling timed out
            if (isCancelled) return;

            setCredits(latestBalance);
            setNewCreditsAdded(null);
            setPaymentConfirmed(false);
            setStatusMessage(
                "Payment received, but credits are still syncing. They will appear in your account shortly."
            );
            setLoading(false);
        };

        finalizePurchaseState();

        return () => {
            isCancelled = true;
        };
    }, [refreshUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">{statusMessage}</p>
                    <p className="text-gray-400 text-sm mt-2">Please do not close this window.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500 mb-8">{statusMessage}</p>

                    {paymentConfirmed && newCreditsAdded !== null ? (
                        <div className="mb-8 space-y-4">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                                <p className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-1">Credits Added</p>
                                <p className="text-4xl font-black text-green-700">+{newCreditsAdded}</p>
                            </div>
                            
                            {credits !== null && (
                                <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-center space-x-3">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    <span className="text-lg font-bold text-gray-900">
                                        {credits} Total Balance
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8 text-center">
                            <div className="flex justify-center mb-3">
                                <RefreshCcw className="w-6 h-6 text-amber-600 animate-spin" />
                            </div>
                            <p className="text-amber-900 font-bold mb-1">Syncing in progress</p>
                            <p className="text-amber-800 text-sm">
                                Your payment is confirmed. Credits usually appear within 1-2 minutes. 
                                You can safely leave this page and check your dashboard later.
                            </p>
                            {credits !== null && (
                                <div className="mt-4 pt-4 border-t border-amber-200/50">
                                    <p className="text-xs text-amber-700 uppercase font-semibold">Current Balance</p>
                                    <p className="text-xl font-bold text-amber-900">{credits} credits</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/dashboard" className="w-full">
                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl">
                                Start Converting
                            </Button>
                        </Link>
                        <Link href="/dashboard/credits" className="w-full">
                            <Button variant="outline" className="w-full h-12 text-lg font-semibold rounded-xl border-gray-200 hover:bg-gray-50">
                                View History <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
