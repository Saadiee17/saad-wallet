"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { List, FileText, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ActivityPage() {
    const { activeProfile } = useApp();

    const mockTransactions = [
        { id: 1, desc: 'Shell Pakistan', amount: 5000, type: 'Purchase', date: 'Feb 12' },
        { id: 2, desc: 'Imtiaz Super Market', amount: 12400, type: 'Purchase', date: 'Feb 10' },
        { id: 3, desc: 'Bill Payment - K-Electric', amount: 15150, type: 'Purchase', date: 'Feb 08' },
        { id: 4, desc: 'Statement Credit', amount: 25000, type: 'Payment', date: 'Feb 05' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 pb-32 max-w-lg mx-auto space-y-10"
        >
            {/* PDF Ingest Card */}
            <motion.section
                whileHover={{ scale: 1.02 }}
                className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20 flex items-center justify-between cursor-pointer group overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                    <FileText size={120} />
                </div>
                <div className="relative z-10 space-y-2">
                    <h3 className="text-xl font-black text-white">Ingest Statement</h3>
                    <p className="text-sm text-indigo-100 font-medium">Upload PDF to sync transactions</p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl text-white relative z-10">
                    <ArrowUpRight size={24} />
                </div>
            </motion.section>

            {/* Transaction Ledger */}
            <section className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-800 rounded-2xl text-slate-400">
                            <List size={22} />
                        </div>
                        <h2 className="font-bold text-xl text-white">Ledger</h2>
                    </div>
                    <div className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                        <Search size={20} />
                    </div>
                </div>

                <div className="space-y-6">
                    {mockTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-2xl ${tx.type === 'Payment' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {tx.type === 'Payment' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div>
                                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{tx.desc}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{tx.date} • {tx.type}</p>
                                </div>
                            </div>
                            <p className={`font-black tracking-tight ${tx.type === 'Payment' ? 'text-emerald-400' : 'text-slate-100'}`}>
                                {tx.type === 'Payment' ? '-' : ''} {tx.amount.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                <button className="w-full py-6 bg-slate-800/50 border border-white/5 rounded-[2rem] text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-800 hover:text-white transition-all">
                    View Full History
                </button>
            </section>
        </motion.div>
    );
}
