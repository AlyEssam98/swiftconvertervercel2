"use client";

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const { login } = useAuth();
    
    const [status, setStatus] = useState('loading' as 'loading' | 'success' | 'error');
    const [message, setMessage] = useState('Verifying your email address...');
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!token || hasFetched.current) {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. No token provided.');
            }
            return;
        }

        hasFetched.current = true;

        const verifyToken = async () => {
            try {
                const res = await api.post('/api/v1/auth/verify', { token });
                const data = res.data;
                
                setStatus('success');
                setMessage('Email verified successfully!');
                
                // If the backend returns a token, log the user in
                if (data && (data.token || data.accessToken || data.access_token)) {
                    const jwtToken = data.token || data.accessToken || data.access_token;
                    login(jwtToken);
                    // Redirect to dashboard after a short delay
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } else {
                    // Just redirect to login
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 2000);
                }
            } catch (err: any) {
                console.error('Verification error:', err);
                // Don't show error if we already succeeded (race condition safeguard)
                setStatus((prev: string) => prev === 'success' ? 'success' : 'error');
                if (err.response?.data?.message) {
                    setMessage((_prev: string) => status === 'success' ? 'Email verified successfully!' : err.response.data.message);
                } else {
                    setMessage((_prev: string) => status === 'success' ? 'Email verified successfully!' : 'Failed to verify email. The link may be expired or invalid.');
                }
            }
        };

        verifyToken();
    }, [token, router, login, status]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
                
                {status === 'loading' && (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                        <h2 className="text-2xl font-bold text-gray-900">Verifying Email</h2>
                        <p className="text-gray-500">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Verification Complete</h2>
                        <p className="text-gray-500">{message}</p>
                        <p className="text-sm text-gray-400">Redirecting...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                        <p className="text-red-600">{message}</p>
                        <div className="flex space-x-4 pt-4">
                            <Button asChild variant="outline">
                                <Link href="/auth/login">Back to Login</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
