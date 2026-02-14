"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import PathComparison from '@/components/dashboard/DebtConsolidationTool';
import DeadMoneyCard from '@/components/dashboard/DeadMoneyCard';
import FinancialActionPlan from '@/components/dashboard/FinancialActionPlan';

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function StrategyPage() {
    const { config, isSBS, setIsSBS, simulation } = useApp();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-32 max-w-lg mx-auto"
        >
            <div className="p-6 space-y-8">
                <PathComparison
                    currentBalance={config.currentBalance}
                    isSBS={isSBS}
                    onToggle={(val) => setIsSBS(val)}
                />

                {!isSBS && (
                    <DeadMoneyCard
                        lateFee={2500}
                        projectedInterest={simulation.interest}
                        utilityFees={65}
                    />
                )}

                <FinancialActionPlan />
            </div>
        </motion.div>
    );
}
