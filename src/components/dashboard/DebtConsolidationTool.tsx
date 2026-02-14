"use client";

import React from 'react';
import { Target, Zap, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PathComparisonProps {
    currentBalance: number;
    isSBS: boolean;
    onToggle: (val: boolean) => void;
}

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function PathComparison({ currentBalance, isSBS, onToggle }: PathComparisonProps) {
    const savings = 14500; // Calculated yearly gain

    // SVG Gauge Component
    const Gauge = ({ value }: { value: number }) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (value / 100) * circumference;

        return (
            <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate- 90">
                    <circle
                        cx="72"
                        cy="72"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-slate-800/50"
                    />
                    <motion.circle
                        cx="72"
                        cy="72"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ ...SpringConfig, duration: 2 }}
                        strokeLinecap="round"
                        fill="transparent"
                        className="text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl text-apple-title text-white"
                    >
                        {savings.toLocaleString()}
                    </motion.p>
                    <p className="text-apple-caption vibrant-text mt-1">Yearly Gain</p>
                </div>
            </div>
        );
    };

    return (
        <section className="glass-morphism rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-apple-caption vibrant-text">Optimal Strategy</h2>

                {/* High-Quality Toggle */}
                <div className="flex items-center gap-3">
                    <span className={`text-apple-caption !tracking-tight lowercase transition-colors ${!isSBS ? 'text-indigo-400' : 'vibrant-text'}`}>Rev</span>
                    <button
                        onClick={() => onToggle(!isSBS)}
                        className={`w-12 h-7 rounded-full p-1 transition-colors duration-500 relative ${isSBS ? 'bg-emerald-500' : 'bg-slate-800'}`}
                    >
                        <motion.div
                            animate={{ x: isSBS ? 20 : 0 }}
                            transition={SpringConfig}
                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                        />
                    </button>
                    <span className={`text-apple-caption !tracking-tight lowercase transition-colors ${isSBS ? 'text-emerald-400' : 'vibrant-text'}`}>SBS</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/5 blur-[50px] rounded-full" />
                    <Gauge value={75} />
                </div>

                <div className="w-full space-y-3">
                    <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                        <div>
                            <p className="text-apple-caption vibrant-text mb-0.5">Recommended Path</p>
                            <h3 className="text-lg text-apple-metric text-white">Alfalah Smart Plan</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-apple-caption !text-emerald-400 mb-0.5">Target</p>
                            <p className="text-lg text-apple-metric text-white">2.88% <span className="text-xs opacity-40">Flat</span></p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isSBS ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-rose-500/[0.03] border border-rose-500/10 p-5 rounded-2xl"
                            >
                                <p className="text-xs text-rose-200/60 leading-relaxed font-medium">
                                    Current revolving path leaks <span className="text-rose-400 font-bold">~14,657 PKR</span> monthly. Locking in SBS eliminates this overhead.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-2xl shadow-emerald-500/20 text-center space-y-4"
                            >
                                <p className="text-apple-caption !text-white opacity-80">Guaranteed Monthly Savings</p>
                                <h3 className="text-3xl text-apple-title">PKR 14,657</h3>
                                <button className="w-full bg-white text-emerald-600 py-4 rounded-2xl text-apple-caption !text-emerald-600 flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform">
                                    Finalize Conversion <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
