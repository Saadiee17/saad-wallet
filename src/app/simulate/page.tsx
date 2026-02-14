"use client";

import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import VictoryCountdown from '@/components/dashboard/VictoryCountdown';
import TactileSlider from '@/components/dashboard/TactileSlider';
import PrioritySettlement from '@/components/dashboard/PrioritySettlement';
import { PlayCircle } from 'lucide-react';
import { useEffect } from 'react';

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

export default function SimulatePage() {
    const {
        config,
        isSBS,
        sliderValue,
        setSliderValue,
        settlementAmount,
        setSettlementAmount,
        simulation
    } = useApp();

    const criticalTarget = 14063;
    const outperformance = sliderValue - ((config.currentBalance * (isSBS ? 0.0288 : 0.0392)) / 30);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-32 max-w-lg mx-auto"
        >
            <div className="p-6 space-y-8">
                <VictoryCountdown
                    currentBalance={isSBS ? config.currentBalance + 6200 : config.currentBalance}
                    monthlyPayment={isSBS ? 24740 : sliderValue}
                    unpaidMinimum={config.unpaidMinimum}
                    settlementAmount={settlementAmount}
                />

                <PrioritySettlement
                    value={settlementAmount}
                    onChange={setSettlementAmount}
                    currentBalance={config.currentBalance}
                />

                {!isSBS && (
                    <motion.section
                        className="glass-morphism rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 pb-4 flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <PlayCircle size={20} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-apple-metric text-lg text-white">Tactile Simulator</h2>
                        </div>

                        <div className="px-8 pb-8 space-y-6">
                            <TactileSlider
                                min={5000}
                                max={config.currentBalance}
                                value={sliderValue}
                                onChange={setSliderValue}
                                criticalTarget={criticalTarget}
                            />

                            <div className="p-6 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20" />
                                <p className="text-apple-caption vibrant-text">Monthly Outperformance</p>
                                <p className="text-3xl text-apple-title text-emerald-400 mt-1">
                                    <span className="text-sm opacity-50 mr-1">PKR</span>
                                    <AnimatedNumber value={Math.max(0, outperformance)} />
                                </p>
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </motion.div>
    );
}
