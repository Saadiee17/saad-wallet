"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmptyCardState({ name }: { name: string }) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[3.5rem] glass-morphism shadow-2xl text-center space-y-8 relative overflow-hidden group"
        >
            {/* Animated background blobs */}
            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full animate-pulse delay-1000" />

            <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <CreditCard size={40} className="text-indigo-400" strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl text-apple-title text-white">Welcome, {name}</h2>
                    <p className="text-sm text-apple-label vibrant-text max-w-[200px] mx-auto leading-relaxed">
                        Your dashboard is ready. Let's start by configuring your first card.
                    </p>
                </div>

                <button
                    onClick={() => router.push('/settings')}
                    className="w-full py-5 bg-white text-[#020617] font-black rounded-[2rem] flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-50 active:scale-[0.98] transition-all"
                >
                    <Sparkles size={18} />
                    Sync My First Card
                    <ArrowRight size={18} />
                </button>
            </div>
        </motion.div>
    );
}
