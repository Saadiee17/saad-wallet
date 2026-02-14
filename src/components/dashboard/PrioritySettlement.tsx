"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, TrendingDown, Wallet } from 'lucide-react';

interface PrioritySettlementProps {
    value: number;
    onChange: (val: number) => void;
    currentBalance: number;
}

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function PrioritySettlement({ value, onChange, currentBalance }: PrioritySettlementProps) {
    const interestKilled = value * 0.0392 * 6; // Rough estimate: 6 months of interest saved
    const limitRestored = value;
    const monthlySavings = value * 0.0392;

    return (
        <section className="bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />

            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                    <Zap size={24} strokeWidth={1.5} />
                </div>
                <h2 className="font-bold text-xl text-white">Priority Settlement</h2>
            </div>

            <div className="space-y-6">
                <div className="relative group">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block pl-2">One-Time Payout Settlement</label>
                    <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-slate-500">PKR</span>
                        <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(Number(e.target.value))}
                            placeholder="0"
                            className="w-full bg-slate-800/40 border border-white/5 rounded-[2rem] py-8 pl-20 pr-8 text-3xl font-black text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-slate-800"
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {value > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={SpringConfig}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
                        >
                            <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] space-y-3">
                                <div className="flex items-center gap-3 text-emerald-400">
                                    <TrendingDown size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Interest Killed</span>
                                </div>
                                <p className="text-2xl font-black text-white">
                                    <span className="text-xs mr-2 opacity-40 font-bold">PKR</span>
                                    {Math.round(interestKilled).toLocaleString()}
                                </p>
                            </div>

                            <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] space-y-3">
                                <div className="flex items-center gap-3 text-indigo-400">
                                    <Shield size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Limit Restored</span>
                                </div>
                                <p className="text-2xl font-black text-white">
                                    <span className="text-xs mr-2 opacity-40 font-bold">PKR</span>
                                    {Math.round(limitRestored).toLocaleString()}
                                </p>
                            </div>

                            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-3">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Wallet size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Monthly Savings</span>
                                </div>
                                <p className="text-2xl font-black text-white">
                                    <span className="text-xs mr-2 opacity-40 font-bold">PKR</span>
                                    {Math.round(monthlySavings).toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
