"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Info, AlertCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function BreakdownPage() {
    const router = useRouter();
    const { simulation, isSBS } = useApp();

    const lateFee = isSBS ? 0 : 2500;
    const items = [
        { id: '1', name: 'Late Payment Fee', amount: lateFee, category: 'Penalty', desc: 'Standard charge for payments received after the due date.', icon: AlertCircle },
        { id: '2', name: 'Service Charge', amount: simulation.interest, category: 'Interest', desc: '3.92% recurring fee on your average daily balance.', icon: Info },
        { id: '3', name: 'Utility Service Fee', amount: simulation.fees, category: 'Fee', desc: 'Fixed processing fee for statement-based utility transactions.', icon: ShieldAlert },
    ];

    const total = lateFee + simulation.interest + simulation.fees;

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SpringConfig}
            className="min-h-screen bg-[#0F172A] pb-32"
        >
            {/* iOS Style Header */}
            <header className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-3xl px-8 pt-16 pb-8 space-y-8 border-b border-white/5">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-indigo-400 font-bold hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                    <span>Back</span>
                </button>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter">Dead Money</h1>
                    <p className="text-slate-500 font-medium">Interest and Fee Itemization</p>
                </div>
            </header>

            <main className="p-8 space-y-12">
                {/* Total Summary */}
                <section className="bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] p-10 text-center space-y-3">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Total Bleed This Month</p>
                    <h2 className="text-5xl font-black text-white tracking-tighter">
                        <span className="text-2xl mr-2 text-slate-500">PKR</span>
                        {total.toLocaleString()}
                    </h2>
                </section>

                {/* Detailed List */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Itemized Accruals</h3>

                    <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/5 divide-y divide-white/5 overflow-hidden">
                        {items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    className="p-8 flex items-start gap-6 hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="p-4 bg-slate-800 rounded-2xl text-slate-400 shrink-0">
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-lg text-white">{item.name}</h4>
                                            <p className="text-lg font-black text-white">
                                                {item.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.category}</p>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium pt-1">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Insight Card */}
                <div className="p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 space-y-4">
                    <h4 className="font-black text-white uppercase tracking-widest text-xs italic">Strategy Tip</h4>
                    <p className="text-indigo-100 font-medium text-sm leading-relaxed">
                        These charges are <span className="text-white font-bold">non-recoverable</span>. Paying even PKR 500 above your minimum reduces the service charge for the following statement date.
                    </p>
                </div>
            </main>
        </motion.div>
    );
}
