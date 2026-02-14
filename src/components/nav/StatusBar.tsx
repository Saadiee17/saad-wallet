"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CheckCircle2, Wifi } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function StatusBar() {
    const { isSyncing, activeProfile } = useApp();

    if (!activeProfile) return null;

    return (
        <div className="fixed top-0 left-0 right-0 h-10 glass-morphism border-t-0 border-x-0 rounded-none flex items-center justify-between px-8 z-[100] backdrop-blur-2xl">
            {/* Left: Device Info mockup */}
            <div className="flex items-center gap-2">
                <span className="text-apple-caption vibrant-text">Alfalah 5G</span>
                <Wifi size={10} className="text-slate-600" />
            </div>

            {/* Right: Sync Status */}
            <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                    {isSyncing ? (
                        <motion.div
                            key="syncing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-apple-caption !text-indigo-400">Syncing</span>
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <Cloud size={12} className="text-indigo-400" />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 3, times: [0, 0.1, 0.8, 1] }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-apple-caption !text-emerald-400">Synced</span>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
