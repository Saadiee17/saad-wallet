"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface DeadMoneyCardProps {
    lateFee: number;
    projectedInterest: number;
    utilityFees: number;
}

export default function DeadMoneyCard({ lateFee = 2500, projectedInterest = 9721, utilityFees = 0 }: DeadMoneyCardProps) {
    const router = useRouter();
    const totalDeadMoney = lateFee + projectedInterest + utilityFees;

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/activity/breakdown')}
            className="group cursor-pointer glass-morphism rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all hover:bg-slate-900/40 active:scale-[0.98]"
        >
            <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl group-hover:scale-105 transition-transform duration-500">
                            <AlertTriangle size={20} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm text-apple-metric text-slate-300">
                                Bleed Detection: <span className="text-white font-black">{totalDeadMoney.toLocaleString()}</span>
                            </p>
                            <p className="text-apple-caption !text-rose-500/60 leading-none">Capital Leakage Detail</p>
                        </div>
                    </div>
                    <div className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
