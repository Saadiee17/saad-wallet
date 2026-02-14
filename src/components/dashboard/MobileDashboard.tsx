"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { calculateMonthlyCharges, Transaction } from '@/lib/interest-utils';
import PathComparison from './DebtConsolidationTool';
import DeadMoneyCard from './DeadMoneyCard';
import VictoryCountdown from './VictoryCountdown';
import FutureStatement from './FutureStatement';
import PrioritySettlement from './PrioritySettlement';
import FinancialActionPlan from './FinancialActionPlan';
import {
    CreditCard,
    TrendingUp,
    Wallet,
    AlertCircle,
    ChevronRight,
    ArrowDownCircle,
    PiggyBank,
    History,
    Zap,
    Sparkles,
    Settings,
    PlayCircle,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

interface DashboardProps {
    creditLimit?: number;
    currentBalance?: number;
    unpaidMinimum?: number;
    previousStatementBalance?: number;
    dailyBalances?: number[];
    transactions?: Transaction[];
    lastPaymentDate?: string;
    profile?: { id: string; name: string; avatar_url: string };
    onSwitchProfile?: () => void;
}

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

const AnimatedNumber = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    useEffect(() => {
        const controls = animate(count as any, value as any, {
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 1,
            precision: 0.1
        } as any);
        return controls.stop;
    }, [value, count]);

    return (
        <motion.span className="tabular-nums inline-block">
            {rounded}
        </motion.span>
    );
};

const TactileSlider = ({ min, max, value, onChange, criticalTarget }: { min: number, max: number, value: number, onChange: (val: number) => void, criticalTarget: number }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const thresholdPercentage = ((criticalTarget - min) / (max - min)) * 100;

    const getTrackBackground = () => {
        const isPastThreshold = value >= criticalTarget;
        if (isPastThreshold) {
            return `linear-gradient(90deg, #F43F5E 0%, #F43F5E ${thresholdPercentage}%, #10B981 ${thresholdPercentage}%, #10B981 ${percentage}%, #1E293B ${percentage}%)`;
        }
        return `linear-gradient(90deg, #F43F5E 0%, #F43F5E ${percentage}%, #1E293B ${percentage}%)`;
    };

    return (
        <div className="relative w-full py-8">
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={500}
                    value={value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (Math.abs(val - criticalTarget) < (max - min) * 0.02) {
                            onChange(criticalTarget);
                        } else {
                            onChange(val);
                        }
                    }}
                    style={{ background: getTrackBackground() }}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer accent-white transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] bg-slate-800"
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-8 bg-white/30 rounded-full pointer-events-none border border-white/20"
                    style={{ left: `${thresholdPercentage}%` }}
                />
            </div>
            <div className="flex justify-between mt-6 px-1">
                <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Min</span><span className="text-xs font-bold text-slate-300">{min.toLocaleString()}</span></div>
                <div className="flex flex-col items-center"><span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Target</span><span className="text-xs font-bold text-rose-400">{criticalTarget.toLocaleString()}</span></div>
                <div className="flex flex-col items-end"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Max</span><span className="text-xs font-bold text-slate-300">{max.toLocaleString()}</span></div>
            </div>
        </div>
    );
};

export default function MobileDashboard({
    creditLimit = 300000,
    currentBalance = 248000,
    unpaidMinimum = 12400,
    previousStatementBalance = 260000,
    dailyBalances = Array(15).fill(248000),
    transactions = [
        { category: 'Purchase', amount: 1500, postingDate: '2026-02-28' },
        { category: 'Utility Bill', amount: 6000, postingDate: '2026-03-05' }
    ],
    lastPaymentDate = '2026-01-05',
    profile,
    onSwitchProfile
}: DashboardProps) {
    const [config, setConfig] = useState({
        creditLimit,
        currentBalance: 262799,
        unpaidMinimum,
        lastPaymentDate
    });

    const [sliderValue, setSliderValue] = useState(15000);
    const [activeView, setActiveView] = useState<'dashboard' | 'settings'>('dashboard');
    const [isSBS, setIsSBS] = useState(false);
    const [settlementAmount, setSettlementAmount] = useState(0);

    const statementDate = new Date('2026-03-15');
    const criticalTarget = 14063;

    // SBS Reality Flipping
    const currentRate = isSBS ? 0.0288 : 0.0392;
    const outperformance = sliderValue - ((config.currentBalance * currentRate) / 30);

    const simulation = useMemo(() => {
        const simulated = calculateMonthlyCharges(
            dailyBalances,
            config.unpaidMinimum,
            sliderValue,
            previousStatementBalance,
            statementDate,
            config.creditLimit,
            transactions,
            isSBS // Assuming utility is updated to handle rate switch if needed, else we shim it
        );

        const LATE_FEE = isSBS ? 0 : 2500;
        const totalDeadMoney = LATE_FEE + (isSBS ? (config.currentBalance * 0.0288) : (simulated.projectedInterest + simulated.projectedFees));
        const debtReduction = sliderValue - totalDeadMoney;

        return {
            fees: simulated.projectedFees,
            interest: simulated.projectedInterest,
            debtReduction,
            totalDeadMoney
        };
    }, [dailyBalances, config.unpaidMinimum, sliderValue, previousStatementBalance, statementDate, config.creditLimit, transactions, isSBS]);

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sf selection:bg-indigo-500/30 overflow-x-hidden">
            <AnimatePresence mode="wait">
                {activeView === 'dashboard' ? (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={SpringConfig}
                        className="relative z-10 p-8 pb-32 max-w-lg mx-auto space-y-10"
                    >
                        {/* Apple Hero Card */}
                        <motion.section
                            whileHover={{ scale: 1.02, y: -5 }}
                            transition={SpringConfig}
                            className="relative p-10 rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] bg-gradient-to-br from-slate-800/80 to-slate-900/95 backdrop-blur-3xl group"
                        >
                            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 blur-[100px] rounded-full" />
                            <div className="relative z-10 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Bank Alfalah Visa Platinum</p>
                                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Current Balance</p>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-2xl font-black text-slate-500">PKR</span>
                                            <h1 className="text-5xl font-black tracking-tighter text-white">
                                                <AnimatedNumber value={isSBS ? config.currentBalance + 6200 : config.currentBalance} />
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="h-12 w-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-xl border border-amber-500/30 flex items-center justify-center backdrop-blur-md relative overflow-hidden">
                                        {profile ? (
                                            <motion.img
                                                layoutId={`avatar-${profile.id}`}
                                                src={profile.avatar_url}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-8 bg-amber-500/40 rounded shadow-inner" />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available</p>
                                        <p className="text-2xl font-black text-emerald-400">33,201 <span className="text-xs opacity-50">PKR</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rate</p>
                                        <div className="flex flex-col">
                                            <p className={`text-2xl font-black transition-colors ${isSBS ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {(currentRate * 100).toFixed(2)}%
                                            </p>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1">
                                                {isSBS ? 'SBS FLAT RATE' : '3.92% SERVICE CHARGE'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <div className="space-y-10">
                            {/* Path Comparison - Now the Centerpiece logic */}
                            <PathComparison
                                currentBalance={config.currentBalance}
                                isSBS={isSBS}
                                onToggle={(val) => setIsSBS(val)}
                            />

                            <AnimatePresence mode="popLayout">
                                {!isSBS && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={SpringConfig}
                                    >
                                        <DeadMoneyCard
                                            lateFee={2500}
                                            projectedInterest={9346}
                                            utilityFees={65}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

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

                            <FutureStatement
                                currentBalance={config.currentBalance}
                                payment={isSBS ? 24740 : sliderValue}
                                projectedInterest={simulation.interest}
                                projectedFees={simulation.fees}
                                criticalTarget={criticalTarget}
                                currentBill={config.unpaidMinimum}
                            />

                            {/* Tactical Simulator - Hidden in SBS mode for clean UI as per core numbers flipping */}
                            <AnimatePresence mode="popLayout">
                                {!isSBS && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={SpringConfig}
                                        className="bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-10"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400"><PlayCircle size={24} strokeWidth={1.5} /></div>
                                            <h2 className="font-bold text-xl text-white">Tactile Simulator</h2>
                                        </div>

                                        <div className="p-10 bg-slate-800/30 rounded-[2.5rem] border border-white/5">
                                            <TactileSlider
                                                min={5000}
                                                max={config.currentBalance}
                                                value={sliderValue}
                                                onChange={setSliderValue}
                                                criticalTarget={criticalTarget}
                                            />
                                            <div className="mt-10 p-8 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5 text-center">
                                                <p className="text-sm font-medium text-slate-300">Outperforming interest by</p>
                                                <p className="text-3xl font-black text-emerald-400 mt-2">PKR <AnimatedNumber value={Math.max(0, outperformance)} /></p>
                                            </div>
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>

                            <FinancialActionPlan />
                        </div>
                    </motion.div>
                ) : (
                    <motion.section
                        key="settings"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={SpringConfig}
                        className="p-8 pb-32 max-w-lg mx-auto"
                    >
                        <header className="flex items-center justify-between mb-12">
                            <button onClick={() => setActiveView('dashboard')} className="h-14 w-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft size={24} strokeWidth={1.5} /></button>
                            <h2 className="text-2xl font-black text-white">Settings</h2>
                            <div className="w-14 h-14" />
                        </header>
                        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-10">
                            <div className="space-y-8">
                                <button
                                    onClick={onSwitchProfile}
                                    className="w-full bg-slate-800/80 border border-white/5 py-6 rounded-[2rem] text-slate-300 font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                                >
                                    <History size={20} />
                                    Switch Profile
                                </button>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Current Balance</label>
                                    <input type="number" value={config.currentBalance} onChange={e => setConfig({ ...config, currentBalance: Number(e.target.value) })} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-[2rem] p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                                </div>
                                <button onClick={() => setActiveView('dashboard')} className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-indigo-500/30 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]">Confirm & Save</button>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Premium Bottom Nav */}
            <nav className="fixed bottom-8 left-8 right-8 h-22 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex items-center justify-around px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
                <button className="p-4 text-indigo-400"><TrendingUp size={28} strokeWidth={1.5} /></button>
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 active:scale-90 transition-transform cursor-pointer"><span className="text-3xl font-light">+</span></div>
                <button className="p-4 text-slate-500 hover:text-slate-200 transition-colors" onClick={() => setActiveView('settings')}><Settings size={26} strokeWidth={1.5} /></button>
            </nav>
        </div>
    );
}
