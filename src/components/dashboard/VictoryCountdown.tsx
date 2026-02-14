"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';
import { Trophy, Calendar, Sparkles, Target } from 'lucide-react';
import { calculateMonthsToZero } from '@/lib/interest-utils';

interface VictoryCountdownProps {
    currentBalance: number;
    monthlyPayment: number;
    unpaidMinimum: number;
    settlementAmount?: number;
}

const AnimatedNumber = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1,
            type: "spring",
            bounce: 0.3,
            stiffness: 80
        } as any);
        return controls.stop;
    }, [value, count]);

    return <motion.span>{rounded}</motion.span>;
};

export default function VictoryCountdown({ currentBalance, monthlyPayment, unpaidMinimum, settlementAmount = 0 }: VictoryCountdownProps) {
    const adjustedBalance = Math.max(0, currentBalance - settlementAmount);
    const months = calculateMonthsToZero(adjustedBalance, monthlyPayment);

    // Target Payment Calculation
    const LATE_FEE = 2500;
    const EXCISE_DUTY_RATE = 0.15;
    const exciseDuty = LATE_FEE * EXCISE_DUTY_RATE;
    const targetPayment = unpaidMinimum + LATE_FEE + exciseDuty;

    const getVictoryDate = () => {
        if (months === Infinity) return null;
        const date = new Date('2026-02-14');
        date.setMonth(date.getMonth() + months);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const victoryDate = getVictoryDate();

    return (
        <section className="relative bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <Trophy size={20} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-200">Victory Countdown</h2>
                </div>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {months === Infinity ? (
                        <motion.div
                            key="growing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="py-4"
                        >
                            <p className="text-rose-500 font-black text-2xl uppercase tracking-tighter">
                                Never-Ending Debt
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                Payment is lower than monthly interest.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={victoryDate}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-indigo-400/80">
                                    <Calendar size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Debt-Free Date</span>
                                </div>
                                <motion.h3
                                    key={victoryDate}
                                    animate={settlementAmount > 0 ? {
                                        x: [-2, 2, -2, 2, 0],
                                        transition: { duration: 0.4, repeat: 1 }
                                    } : {}}
                                    className="text-4xl font-black tracking-tighter text-white"
                                >
                                    {victoryDate}
                                </motion.h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Months Left</p>
                                    <p className="text-2xl font-black text-indigo-400">
                                        <AnimatedNumber value={months} />
                                    </p>
                                </div>
                                <div className="p-5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Pace</p>
                                    <p className="text-sm font-bold text-emerald-400">Fast-Track</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Critical Target Section */}
            <motion.div
                animate={{
                    boxShadow: [
                        "0 0 0px 0px rgba(244, 63, 94, 0)",
                        "0 0 20px 2px rgba(244, 63, 94, 0.2)",
                        "0 0 0px 0px rgba(244, 63, 94, 0)"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 p-6 bg-rose-500/5 border border-rose-500/20 rounded-[2rem] relative overflow-hidden"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Critical Target</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-rose-300 opacity-60">PKR</span>
                    <p className="text-3xl font-black text-rose-500 tracking-tighter">
                        <AnimatedNumber value={targetPayment} />
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
