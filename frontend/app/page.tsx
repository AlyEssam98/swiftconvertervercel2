"use client";

import { useState, useEffect } from 'react';
import { callHealthCheck } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap, Shield, Clock, FileCode2, ArrowRightLeft, Globe, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import ConversionTool from '@/components/conversion/ConversionTool';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        callHealthCheck();
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    } as const;

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "SoftwareApplication",
                                "name": "SwiftMX Bridge",
                                "applicationCategory": "FinanceApplication",
                                "operatingSystem": "Web",
                                "description": "Professional SWIFT MT to MX conversion and ISO 20022 mapping tool for financial institutions.",
                                "offers": {
                                    "@type": "Offer",
                                    "price": "0",
                                    "priceCurrency": "USD"
                                }
                            }
                        ]
                    })
                }}
            />
            
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-10 h-10 flex items-center justify-center"
                        >
                            <img src="/logo.png" alt="SwiftMX Bridge Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">SwiftMX Bridge</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Enterprise Translation</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Blog</Link>
                        <Link href="/error-codes" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Error Codes</Link>
                        <Link href="/field-explorer" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Explorer</Link>
                        <div className="h-4 w-px bg-border mx-2" />
                        {user ? (
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Dashboard</Link>
                        ) : (
                            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">Sign in</Link>
                        )}
                        <ThemeToggle />
                        <Link href={user ? "/dashboard" : "/auth/register"}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                {user ? "Go to Dashboard" : "Get Started"}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center space-x-4">
                        <ThemeToggle />
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-foreground">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Nav Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-background border-b border-border overflow-hidden"
                        >
                            <div className="flex flex-col p-4 space-y-4">
                                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-base font-medium">Blog</Link>
                                <Link href="/error-codes" onClick={() => setIsMenuOpen(false)} className="text-base font-medium">Error Codes</Link>
                                <Link href="/field-explorer" onClick={() => setIsMenuOpen(false)} className="text-base font-medium">Explorer</Link>
                                {user ? (
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-base font-medium">Dashboard</Link>
                                ) : (
                                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-base font-medium">Sign in</Link>
                                )}
                                <Link href={user ? "/dashboard" : "/auth/register"} onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full bg-blue-600">{user ? "Dashboard" : "Get Started Free"}</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden mesh-gradient border-b border-border">
                <div className="container mx-auto px-4 pt-24 pb-32">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                                    <Zap className="w-4 h-4 mr-1 animate-pulse" />
                                    ISO 20022 Migration Ready
                                </div>
                                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                                    Enterprise <span className="text-blue-600 dark:text-blue-400">SWIFT</span> Translation Layer
                                </h1>
                                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                                    Instant, validated conversion from legacy MT formats to modern ISO 20022 MX standards. Bank-grade security for global payments.
                                </p>
                                <div className="flex flex-wrap gap-4 mb-10">
                                    <Link href={user ? "/dashboard/convert" : "/auth/register"}>
                                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-10 text-lg font-bold shadow-2xl shadow-blue-500/30">
                                            {user ? "Convert Now" : "Start Free"}
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="#try-it">
                                        <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold bg-background/50 backdrop-blur-sm border-2">
                                            Live Demo
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground/80">
                                    <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> No CC Required</span>
                                    <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> CBPR+ Compliant</span>
                                    <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> AES-256 Secure</span>
                                </div>
                            </motion.div>
                            
                            {/* Hero Visual */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="hidden lg:block relative"
                            >
                                <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-[3rem] blur-[120px]"></div>
                                <div className="relative glass-morphism rounded-3xl p-8 border border-white/40 dark:border-white/5 shadow-2xl overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-50">
                                        <FileCode2 className="w-32 h-32 text-blue-500/10" />
                                    </div>
                                    <div className="flex items-center space-x-2 mb-6">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                                        <span className="ml-2 text-xs font-mono text-muted-foreground">mt103_to_pacs008.sh</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-950 rounded-xl p-5 font-mono text-xs text-blue-100/90 shadow-inner">
                                            <div className="text-blue-400/80 mb-1">{`{1:F01BANKBEBBAXXX0000000000}`}</div>
                                            <div className="text-green-400/80 mb-3">{`{2:I103BANKBEBBXXXXN}`}</div>
                                            <div className="pl-4 border-l border-blue-500/30 space-y-1">
                                                <div>:20:REF/PAY/2026/001</div>
                                                <div>:32A:260418USD25000,00</div>
                                                <div className="text-blue-400 font-bold">:50K:ALEX CORPORATE INC.</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <motion.div 
                                                animate={{ y: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="bg-blue-600/10 p-2 rounded-full border border-blue-500/20"
                                            >
                                                <ArrowRightLeft className="w-6 h-6 text-blue-500" />
                                            </motion.div>
                                        </div>
                                        <div className="bg-slate-900/50 rounded-xl p-5 font-mono text-xs text-emerald-400/80 border border-emerald-500/10">
                                            <div className="text-muted-foreground/50 mb-2">{`<Document xmlns="urn:iso:std:pacs.008">`}</div>
                                            <div className="pl-4 space-y-1">
                                                <div className="text-emerald-300 font-bold">{`<InstrId>REF/PAY/2026/001</InstrId>`}</div>
                                                <div>{`<IntrBkSttlmAmt Ccy="USD">25000.00</IntrBkSttlmAmt>`}</div>
                                                <div className="text-muted-foreground/30">...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Converter Tool Section */}
            <section id="try-it" className="py-32 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div 
                        {...fadeInUp}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Live Sandbox</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
                                &ldquo;Experience the precision of our transformation engine. No strings attached.&rdquo;
                            </p>
                        </div>
                        <div className="glass-morphism rounded-[2rem] overflow-hidden border border-border shadow-2xl">
                            <div className="bg-muted/50 px-8 py-5 border-b border-border flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <FileCode2 className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-bold tracking-tight">MT ↔ MX Processor</span>
                                </div>
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                </div>
                            </div>
                            <div className="p-8">
                                <ConversionTool />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-muted/30 border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        <FeatureItem
                            icon={<Clock className="w-6 h-6 text-blue-500" />}
                            title="Zero Latency"
                            description="Real-time translation optimized for high-frequency payment rails."
                        />
                        <FeatureItem
                            icon={<Shield className="w-6 h-6 text-emerald-500" />}
                            title="Bank-Grade"
                            description="End-to-end encryption with ephemeral memory processing."
                        />
                        <FeatureItem
                            icon={<FileCode2 className="w-6 h-6 text-indigo-500" />}
                            title="Schema Validated"
                            description="Strict XSD & CBPR+ rule enforcement for NACK-free transfers."
                        />
                        <FeatureItem
                            icon={<Globe className="w-6 h-6 text-amber-500" />}
                            title="Multi-Standard"
                            description="Supporting CHAPS, Fedwire, TARGET2, and global SWIFT network."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden bg-blue-600">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to Bridge the Gap?</h2>
                        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
                            Join over 200+ financial institutions modernizing their payment messaging infrastructure today.
                        </p>
                        <Link href={user ? "/dashboard/convert" : "/auth/register"}>
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-16 px-12 text-xl font-black rounded-2xl shadow-2xl">
                                {user ? "Go to Dashboard" : "Create Free Account"}
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-32 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-20">Frequently Asked</h2>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                        <FAQItem
                            question="Is the conversion CBPR+ compliant?"
                            answer="Absolutely. Every message is validated against the latest SWIFT CBPR+ usage guidelines and official ISO 20022 schemas."
                        />
                        <FAQItem
                            question="How do you handle data privacy?"
                            answer="We use Ephemeral Processing. Messages are translated in-memory and immediately destroyed. We never store financial payloads."
                        />
                        <FAQItem
                            question="Can I integrate this into my core?"
                            answer="Yes, we provide a robust REST API for enterprise customers to plug directly into their core banking systems."
                        />
                        <FAQItem
                            question="What message types do you support?"
                            answer="We currently support MT103, MT202, MT202COV, MT940, and their MX equivalents (pacs, camt)."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-24 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <Link href="/" className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <img src="/logo.png" alt="SwiftMX Bridge Logo" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">SwiftMX Bridge</span>
                            </Link>
                            <p className="text-sm leading-relaxed">
                                Professional financial message transformation for the ISO 20022 era. Global, secure, and instant.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Solutions</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="/" className="hover:text-blue-400 transition-colors">MT to MX Converter</Link></li>
                                <li><Link href="/" className="hover:text-blue-400 transition-colors">ISO 20022 Validator</Link></li>
                                <li><Link href="/field-explorer" className="hover:text-blue-400 transition-colors">Field Explorer</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Technical Blog</Link></li>
                                <li><Link href="/error-codes" className="hover:text-blue-400 transition-colors">Error Database</Link></li>
                                <li><Link href="/legal/terms-of-service" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                                <li><Link href="/legal/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Feedback</h4>
                            <FeedbackForm />
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-12 text-center text-xs">
                        <p>© 2026 SwiftMX Bridge. All rights reserved. Bank-grade MT103 to pacs.008 transformation.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-2xl transition-all duration-300 group"
        >
            <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <div className="group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </motion.div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:border-blue-500/30 transition-colors">
            <h3 className="text-lg font-bold mb-3">{question}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
        </div>
    );
}

function FeedbackForm() {
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || message.length < 10) return;
        
        setSubmitting(true);
        try {
            const api = (await import('@/lib/api')).default;
            await api.post('/api/v1/feedback', { message: message.trim() });
            setSubmitted(true);
            setMessage('');
            toast.success('Feedback sent!');
        } catch (err) {
            toast.error('Failed to send feedback.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) return <p className="text-emerald-500 text-sm font-medium">Thank you for your feedback!</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full h-24 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <Button size="sm" disabled={submitting} className="w-full bg-blue-600 text-xs">
                {submitting ? 'Sending...' : 'Send Feedback'}
            </Button>
        </form>
    );
}
