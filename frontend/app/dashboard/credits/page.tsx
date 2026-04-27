"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, Plus, TrendingUp, Loader2, CheckCircle } from 'lucide-react';

import React, { useState, useEffect, MouseEvent } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { savePendingCreditPurchase } from '@/lib/creditPurchaseStorage';

interface CreditBalance {
    availableCredits: number;
    totalCreditsUsed: number;
    totalCreditsPurchased: number;
    lastUpdated: string;
}

interface CreditPackage {
    id: string;
    name: string;
    description: string;
    credits: number;
    price: number;
    currency: string;
    popular: boolean;
    features: string;
}

export default function CreditsPage() {
    const [creditBalance, setCreditBalance] = useState(null as CreditBalance | null);
    const [packages, setPackages] = useState([] as CreditPackage[]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(null as string | null);
    const { refreshUser } = useAuth();

    useEffect(() => {
        fetchCreditBalance();
        fetchPackages();
    }, []);

    // Refresh credits when page gets focus (returning from payment)
    useEffect(() => {
        const handleFocus = () => {
            fetchCreditBalance();
            refreshUser();
        };
        
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchCreditBalance();
                refreshUser();
            }
        };

        // Also check for redirect with delay to allow webhook to process
        const handlePageShow = (event: any) => {
            if (event.persisted) {
                // Page was restored from bfcache, refresh data
                setTimeout(() => {
                    fetchCreditBalance();
                    refreshUser();
                }, 500);
            }
        };
        
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pageshow', handlePageShow);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, [refreshUser]);

    const fetchCreditBalance = async () => {
        try {
            const response = await api.get<CreditBalance>(`/api/v1/credits/balance?_t=${new Date().getTime()}`);
            setCreditBalance(response.data);
        } catch (error) {
            toast.error('Failed to fetch credit balance');
        }
    };

    const fetchPackages = async () => {
        try {
            const response = await api.get<CreditPackage[]>('/api/v1/credits/packages');
            setPackages(response.data);
        } catch (error) {
            toast.error('Failed to fetch credit packages');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleLSEvent = (event: any) => {
            const lsEvent = event.detail;
            console.log('CreditsPage received LS event:', lsEvent);
            if (lsEvent.event === 'Checkout.Success') {
                toast.success('Purchase successful!');
                fetchCreditBalance();
                refreshUser();
            }
        };

        window.addEventListener('LemonSqueezyEvent', handleLSEvent);
        return () => window.removeEventListener('LemonSqueezyEvent', handleLSEvent);
    }, [refreshUser]);

    const handlePurchase = async (packageId: string, event?: MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        setIsPurchasing(packageId);
        try {
            const response = await api.post<{ checkoutUrl?: string; message: string }>('/api/v1/credits/purchase', { packageId });
            
            if (response.data.checkoutUrl) {
                // Find the package to get the credit amount
                const selectedPackage = packages.find((p: CreditPackage) => p.id === packageId);
                const packageCredits = selectedPackage ? selectedPackage.credits : 0;
                
                // Save pending purchase info
                savePendingCreditPurchase({
                    credits: packageCredits,
                    baselineBalance: creditBalance?.availableCredits ?? 0,
                    timestamp: Date.now()
                });

                // Store current path to return after payment
                sessionStorage.setItem('returnTo', '/dashboard/credits');
                
                // Use Lemon Squeezy overlay if available
                if (typeof window !== 'undefined') {
                    console.log("Lemon Squeezy Debug: Starting purchase flow");
                    
                    const ls = (window as any).LemonSqueezy;
                    console.log("Lemon Squeezy Debug: window.LemonSqueezy type =", typeof ls);

                    if (ls) {
                        // Ensure the URL has embed=1 for the overlay to work correctly
                        let checkoutUrl = response.data.checkoutUrl;
                        if (checkoutUrl && !checkoutUrl.includes('embed=1')) {
                            checkoutUrl += checkoutUrl.includes('?') ? '&embed=1' : '?embed=1';
                        }
                        
                        console.log("Lemon Squeezy Debug: Triggering via dynamic button");
                        // Creating a temporary link with the required class is often more reliable than Url.Open()
                        const link = document.createElement('a');
                        link.href = checkoutUrl;
                        link.className = 'lemonsqueezy-button';
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        
                        try {
                            // Refresh LS to pick up the new button and then click it
                            ls.Refresh();
                            link.click();
                        } catch (e) {
                            console.error("Lemon Squeezy Debug: Dynamic trigger failed", e);
                            window.location.href = checkoutUrl;
                        } finally {
                            // Clean up after a delay
                            setTimeout(() => {
                                if (document.body.contains(link)) {
                                    document.body.removeChild(link);
                                }
                            }, 1000);
                        }
                    } else {
                        // Fallback to direct redirect if LemonSqueezy is missing
                        console.warn("Lemon Squeezy Debug: LemonSqueezy object not found, falling back to redirect.");
                        window.location.href = response.data.checkoutUrl;
                    }
                }
            } else {
                toast.success(response.data.message);
                await fetchCreditBalance();
                await refreshUser();
            }
        } catch (error: unknown) {
            const errorData = (error as { response?: { data?: { message?: string; error?: string } } }).response?.data;
            toast.error(errorData?.message || errorData?.error || 'Failed to purchase credits');
        } finally {
            setIsPurchasing(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Credits</h1>
                <p className="text-gray-500">Manage your conversion credits</p>
            </div>

            {/* Credit Balance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Available Credits</p>
                            <p className="text-3xl font-bold text-gray-900">{creditBalance?.availableCredits ?? 0}</p>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center justify-end space-x-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span>Purchased: {creditBalance?.totalCreditsPurchased ?? 0}</span>
                        </div>
                        <div className="mt-1">Used: {creditBalance?.totalCreditsUsed ?? 0}</div>
                    </div>
                </div>
            </div>

            {/* Credit Packages */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Purchase Credits</h2>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {packages.map((pkg: CreditPackage) => (
                            <div
                                key={pkg.id}
                                className={`relative rounded-xl border p-5 transition-all hover:shadow-lg ${
                                    pkg.popular 
                                        ? 'border-blue-500 bg-blue-50/50' 
                                        : 'border-gray-200 bg-white'
                                }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                        <span className="bg-blue-600 text-white px-3 py-0.5 rounded-full text-xs font-medium">
                                            Popular
                                        </span>
                                    </div>
                                )}
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 mb-3">
                                        <div className="text-4xl font-bold text-blue-600 mb-1">
                                            {pkg.credits}
                                        </div>
                                        <p className="text-sm font-semibold text-blue-700">credits per month</p>
                                        <p className="text-xs text-blue-600 mt-1">30-day expiry</p>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 mb-3">
                                        ${pkg.price}
                                    </div>
                                    <Button
                                        onClick={(e: MouseEvent) => handlePurchase(pkg.id, e)}
                                        disabled={isPurchasing === pkg.id}
                                        className={`w-full ${pkg.popular 
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-gray-900 hover:bg-gray-800'
                                        }`}
                                    >
                                        {isPurchasing === pkg.id ? (
                                            <span className="flex items-center justify-center">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <Plus className="w-4 h-4 mr-1" />
                                                Purchase
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900 mb-1">Credits never expire</p>
                        <p>Each conversion uses 1 credit. Purchase more anytime you need them.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
