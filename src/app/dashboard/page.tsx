"use client";

import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import FutureStatement from '@/components/dashboard/FutureStatement';
import EmptyCardState from '@/components/dashboard/EmptyCardState';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

const AnimatedNumber = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    useEffect(() => {
        const controls = animate(count as any, value as any, {
            type: "spring", stiffness: 260, damping: 20, mass: 1, precision: 0.1
        } as any);
        return controls.stop;
    }, [value, count]);

    return <motion.span className="tabular-nums inline-block">{rounded}</motion.span>;
};

export default function DashboardPage() {
    const { activeProfile, config, isSBS, simulation, sliderValue, isSyncing } = useApp();
    const router = useRouter();

    if (!activeProfile) return null;

    // Empty State: Profile exists but no card config yet (except default initial state)
    // In a real app we'd check if specific fields are zero/null
    const isNewProfile = config.currentBalance === 262799 && !isSyncing; // Using a heuristic for demo

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-32 max-w-lg mx-auto"
        >
            <div className="p-6 space-y-8">
                {isNewProfile ? (
                    <EmptyCardState name={activeProfile.name} />
                ) : (
                    <>
                        {/* Apple Hero Card */}
                        <motion.section
                            whileHover={{ scale: 1.01 }}
                            transition={SpringConfig}
                            className="relative p-8 rounded-[3rem] overflow-hidden glass-morphism shadow-[0_32px_64px_rgba(0,0,0,0.4)] group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-rose-500/30" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-apple-caption vibrant-text mb-4">Alfalah Visa Platinum</p>
                                        <p className="text-xs text-apple-label vibrant-text">Total Outstanding</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-slate-500">PKR</span>
                                            <h1 className="text-4xl text-apple-title text-white">
                                                <AnimatedNumber value={isSBS ? config.currentBalance + 6200 : config.currentBalance} />
                                            </h1>
                                        </div>
                                    </div>
                                    <motion.div
                                        layoutId={`avatar-${activeProfile.id}`}
                                        onClick={() => router.push('/settings')}
                                        className="h-10 w-14 bg-slate-800 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-md relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
                                    >
                                        <img
                                            src={activeProfile.avatar_url}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-apple-caption vibrant-text">Available</p>
                                        <p className="text-xl text-apple-metric text-emerald-400">
                                            {(config.creditLimit - config.currentBalance).toLocaleString()}
                                            <span className="text-[10px] opacity-50 ml-1">PKR</span>
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-apple-caption vibrant-text">Rate</p>
                                        <div className="flex flex-col">
                                            <p className={`text-xl text-apple-metric leading-tight transition-colors ${isSBS ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {((isSBS ? 0.0288 : 0.0392) * 100).toFixed(2)}%
                                            </p>
                                            <p className="text-[7px] font-black uppercase tracking-[0.15em] text-slate-500 mt-0.5">
                                                {isSBS ? 'SBS FLAT' : 'REVOLVING'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <FutureStatement
                            currentBalance={config.currentBalance}
                            payment={isSBS ? 24740 : sliderValue}
                            projectedInterest={simulation.interest}
                            projectedFees={simulation.fees}
                            criticalTarget={14063}
                            currentBill={config.unpaidMinimum}
                        />
                    </>
                )}
            </div>
        </motion.div>
    );
}
