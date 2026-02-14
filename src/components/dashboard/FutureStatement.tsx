"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Calendar, Info, ChevronDown, Clock, Zap } from 'lucide-react';

interface FutureStatementProps {
    currentBalance: number;
    payment: number;
    projectedInterest: number;
    projectedFees: number;
    criticalTarget: number;
    currentBill: number;
}

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

const AnimatedNumber = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    useEffect(() => {
        const controls = animate(count, value, {
            type: "spring", stiffness: 260, damping: 20, mass: 1
        } as any);
        return controls.stop;
    }, [value, count]);

    return <motion.span className="tabular-nums inline-block">{rounded}</motion.span>;
};

export default function FutureStatement({ currentBalance, payment, projectedInterest, projectedFees, criticalTarget, currentBill }: FutureStatementProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const projectedTotal = (currentBalance - payment) + projectedInterest + projectedFees;
    const nextMinDue = projectedTotal * 0.05;
    const interestCapture = (currentBalance - payment) * 0.0392;

    const isBelowCritical = payment < criticalTarget;
    const hasHalo = nextMinDue < currentBill;

    // Calendar generation for next 31 days
    const today = new Date();
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return {
            day: d.getDate(),
            isInterestDay: i === 29 // Mocking the statement date as the 30th day from now
        };
    });

    return (
        <motion.section
            layout
            onClick={() => setIsExpanded(!isExpanded)}
            animate={{
                boxShadow: hasHalo
                    ? "0 0 30px 10px rgba(16, 185, 129, 0.1), 0 0 60px 20px rgba(16, 185, 129, 0.05)"
                    : "0 40px 80px rgba(0,0,0,0.2)"
            }}
            transition={SpringConfig}
            className={`group cursor-pointer bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border relative overflow-hidden transition-all hover:bg-slate-900/60 ${hasHalo ? 'border-emerald-500/30' : 'border-white/5 shadow-2xl'
                }`}
        >
            {/* Halo Insight Tag */}
            {hasHalo && (
                <div className="absolute top-0 right-0 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5"
                    >
                        <Zap size={10} className="text-emerald-400" />
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Budget Positive</span>
                    </motion.div>
                </div>
            )}
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-400">
                            <Calendar size={18} strokeWidth={2} />
                        </div>
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">March 15 Statement Projection</h2>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-slate-600 group-hover:text-slate-400 transition-colors"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </div>

                {/* Primary Metric */}
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 pl-1">Total Statement Balance</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-400">PKR</span>
                        <h3 className="text-4xl font-black tracking-tighter text-white">
                            <AnimatedNumber value={projectedTotal} />
                        </h3>
                    </div>
                </div>

                {/* Secondary Metrics - 'The Magic Reveal' */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group-hover:border-indigo-500/20 transition-all">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Next Minimum Due</p>
                            <p className="text-lg font-black text-indigo-400">
                                <span className="text-xs mr-1 opacity-50">PKR</span>
                                <AnimatedNumber value={nextMinDue} />
                            </p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Projected Interest</p>
                            <p className="text-lg font-black text-emerald-400">
                                <span className="text-xs mr-1 opacity-50">PKR</span>
                                <AnimatedNumber value={interestCapture} />
                            </p>
                        </div>
                    </div>

                    {/* Elasticity Insight Line */}
                    <div className="pt-2 px-1">
                        <p className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                            <span>Projected Minimum Payment</span>
                            <span className="text-white font-black">PKR <AnimatedNumber value={nextMinDue} /></span>
                        </p>
                    </div>

                    {/* Apple-style Insight Warning */}
                    <AnimatePresence>
                        {isBelowCritical && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: 10, height: 0 }}
                                className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start gap-3"
                            >
                                <Info size={14} className="text-rose-400 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-rose-300/80 leading-relaxed font-medium">
                                    Paying less than the Critical Target will increase your minimum payment by <span className="text-rose-400 font-bold">~PKR 850</span> next month.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Expansion State: Interest Roadmap */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={SpringConfig}
                            className="overflow-hidden pt-4"
                        >
                            <div className="h-px bg-white/5 w-full mb-8" />

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={14} className="text-indigo-400" />
                                        Interest Roadmap
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-500">Next 30 Days</span>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2 p-2">
                                    {days.map((day, i) => (
                                        <div
                                            key={i}
                                            className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${day.isInterestDay
                                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-110'
                                                : 'bg-slate-800/50 text-slate-500 border border-white/5'
                                                }`}
                                        >
                                            {day.day}
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl">
                                    <p className="text-[11px] text-rose-200/60 leading-relaxed font-medium">
                                        On <span className="text-rose-400 font-bold">March 15</span>, your daily interest accrual will be finalized and "click" into your principal balance.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
