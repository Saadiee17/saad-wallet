"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ArrowLeft,
    CreditCard,
    Target,
    Calendar,
    Wallet,
    CheckCircle2,
    ShieldAlert
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { useApp } from '@/context/AppContext';

interface OnboardingFlowProps {
    onComplete: (data: any) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const { activeProfile, setConfig } = useApp();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        outstanding: 262799,
        creditLimit: 300000,
        lastPaymentAmount: 9633,
        lastPaymentDate: '2026-01-05',
        minDue: 11188,
        dueDate: '2026-02-06'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalSteps = 5;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSave = async () => {
        if (!activeProfile) return;
        setIsSubmitting(true);
        try {
            // Updated to use AppContext's setConfig which triggers sync
            setConfig({
                creditLimit: formData.creditLimit,
                currentBalance: formData.outstanding,
                unpaidMinimum: formData.minDue,
                lastPaymentDate: formData.lastPaymentDate
            });

            // Handle ledger separately if needed, but for core config we use setConfig
            await supabase
                .from('ledger')
                .upsert({
                    profile_id: activeProfile.id,
                    date: new Date().toISOString().split('T')[0],
                    description: 'Balance Carryover (Onboarding)',
                    amount: formData.outstanding,
                    category: 'Purchase'
                });

            const isPastDue = new Date() > new Date(formData.dueDate);
            onComplete({ ...formData, isRevolving: isPastDue });
        } catch (err: any) {
            console.error("Save Error:", err);
            onComplete({ ...formData, isRevolving: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#0F172A] flex items-center justify-center p-6 overflow-y-auto">
            {/* Glossy Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900/60 backdrop-blur-2xl w-full max-w-md rounded-[3rem] p-8 border border-white/5 shadow-2xl relative"
            >
                {/* Progress Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-1.5">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${i + 1 <= step ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Step {step} of {totalSteps}
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="s1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit text-indigo-400">
                                <Wallet size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Current Outstanding</h2>
                            <p className="text-sm text-slate-400 font-medium">How much do you currently owe on your Alfalah Platinum card?</p>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">PKR</span>
                                <input
                                    type="number"
                                    value={formData.outstanding}
                                    onChange={e => setFormData({ ...formData, outstanding: Number(e.target.value) })}
                                    className="w-full bg-slate-800/50 border border-slate-700/30 rounded-3xl p-6 pl-16 text-2xl font-black text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="s2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-emerald-500/10 rounded-2xl w-fit text-emerald-400">
                                <Target size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Credit Limit</h2>
                            <p className="text-sm text-slate-400 font-medium">Enter your assigned credit limit (Default: 300,000 PKR).</p>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">PKR</span>
                                <input
                                    type="number"
                                    value={formData.creditLimit}
                                    onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                                    className="w-full bg-slate-800/50 border border-slate-700/30 rounded-3xl p-6 pl-16 text-2xl font-black text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="s3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-amber-500/10 rounded-2xl w-fit text-amber-500">
                                <CreditCard size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Last Payment</h2>
                            <p className="text-sm text-slate-400 font-medium">What was your last payment amount and when did you make it?</p>
                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">PKR</span>
                                    <input
                                        type="number"
                                        value={formData.lastPaymentAmount}
                                        onChange={e => setFormData({ ...formData, lastPaymentAmount: Number(e.target.value) })}
                                        className="w-full bg-slate-800/50 border border-slate-700/30 rounded-3xl p-6 pl-16 text-xl font-black text-white outline-none"
                                    />
                                </div>
                                <input
                                    type="date"
                                    value={formData.lastPaymentDate}
                                    onChange={e => setFormData({ ...formData, lastPaymentDate: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/30 rounded-3xl p-6 text-xl font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="s4"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-rose-500/10 rounded-2xl w-fit text-rose-400">
                                <Calendar size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Current Bill</h2>
                            <p className="text-sm text-slate-400 font-medium">Enter your minimum payment due and the due date.</p>
                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">PKR</span>
                                    <input
                                        type="number"
                                        value={formData.minDue}
                                        onChange={e => setFormData({ ...formData, minDue: Number(e.target.value) })}
                                        className="w-full bg-slate-800/50 border border-slate-700/30 rounded-3xl p-6 pl-16 text-xl font-black text-white outline-none"
                                    />
                                </div>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/30 rounded-3xl p-6 text-xl font-bold text-white outline-none focus:ring-2 focus:ring-rose-500/50"
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="s5"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6 text-center"
                        >
                            <div className="p-6 bg-emerald-500/20 rounded-[2rem] w-fit mx-auto text-emerald-400 mb-4">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">All Set!</h2>
                            <div className="space-y-4 text-left">
                                <div className="bg-slate-800/40 p-5 rounded-[2rem] border border-white/5">
                                    <div className="flex items-center gap-3 mb-2 text-rose-400">
                                        <ShieldAlert size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest">Revolving Check</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {new Date() > new Date(formData.dueDate)
                                            ? "Your due date (Feb 6) has passed. We've detected a Revolving Balance state, meaning 3.92% interest is being applied daily."
                                            : "You're currently within your grace period. Pay in full before the due date to stay interest-free!"}
                                    </p>
                                </div>
                                <p className="text-sm text-slate-500 text-center font-medium px-4">
                                    The simulator will now reflect your real debt status and help you plan your recovery.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-10">
                    {step > 1 && step < 5 && (
                        <button
                            onClick={prevStep}
                            className="p-6 bg-slate-800/50 border border-slate-700/30 rounded-3xl text-slate-400 active:scale-95 transition-all"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    {step < 5 ? (
                        <button
                            onClick={nextStep}
                            className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
                        >
                            Continue
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Syncing..." : "Launch Simulator"}
                            <ArrowLeft size={20} className="rotate-180" />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
