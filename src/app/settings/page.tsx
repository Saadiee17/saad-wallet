"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, CreditCard, Wallet, Calendar, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function SettingsPage() {
    const router = useRouter();
    const { config, setConfig, setActiveProfile, activeProfile } = useApp();
    const [localConfig, setLocalConfig] = useState(config);

    const handleSave = () => {
        setConfig(localConfig);
        router.back();
    };

    const handleLogout = () => {
        setActiveProfile(null);
        router.push('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pb-32"
        >
            <header className="sticky top-0 z-50 glass-morphism border-t-0 border-x-0 rounded-none px-8 pt-16 pb-8 space-y-8 backdrop-blur-3xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-indigo-400 font-bold hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                    <span className="text-sm">Dashboard</span>
                </button>
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h1 className="text-3xl text-apple-title text-white">Settings</h1>
                        <p className="text-sm text-apple-label vibrant-text">Card Configuration</p>
                    </div>
                    {activeProfile && (
                        <motion.div
                            layoutId={`avatar-${activeProfile.id}`}
                            className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10"
                        >
                            <img src={activeProfile.avatar_url} className="w-full h-full object-cover" />
                        </motion.div>
                    )}
                </div>
            </header>

            <main className="p-6 space-y-8">
                <section className="glass-morphism rounded-[2.5rem] p-8 shadow-2xl space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-apple-caption px-1">Credit Limit</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">PKR</span>
                                <input
                                    type="number"
                                    value={localConfig.creditLimit}
                                    onChange={e => setLocalConfig({ ...localConfig, creditLimit: Number(e.target.value) })}
                                    className="w-full bg-slate-800/40 border border-white/5 rounded-2xl p-5 pl-16 text-white text-apple-metric focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-apple-caption px-1">Current Balance</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">PKR</span>
                                <input
                                    type="number"
                                    value={localConfig.currentBalance}
                                    onChange={e => setLocalConfig({ ...localConfig, currentBalance: Number(e.target.value) })}
                                    className="w-full bg-slate-800/40 border border-white/5 rounded-2xl p-5 pl-16 text-white text-apple-metric focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-apple-caption px-1">Unpaid Minimum</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">PKR</span>
                                <input
                                    type="number"
                                    value={localConfig.unpaidMinimum}
                                    onChange={e => setLocalConfig({ ...localConfig, unpaidMinimum: Number(e.target.value) })}
                                    className="w-full bg-slate-800/40 border border-white/5 rounded-2xl p-5 pl-16 text-white text-apple-metric focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-white text-[#020617] font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
                    >
                        <Save size={20} />
                        Update Strategy
                    </button>
                </section>

                <button
                    onClick={handleLogout}
                    className="w-full py-5 rounded-2xl border border-white/5 text-slate-500 font-bold flex items-center justify-center gap-2 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                >
                    <LogOut size={18} />
                    Switch Profile
                </button>
            </main>
        </motion.div>
    );
}
