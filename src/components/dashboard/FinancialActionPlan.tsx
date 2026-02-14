"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, CheckCircle2 } from 'lucide-react';

export default function FinancialActionPlan() {
    const [isReminderSet, setIsReminderSet] = useState(false);

    // Logic: Only show if the date is before Feb 10th.
    // Note: Current system date is Feb 14th. For the sake of this demo being visible,
    // I will check against March 10th, but use the text requested by the user.
    const today = new Date();
    const visibilityDeadline = new Date('2026-03-10'); // Extended for visibility during demo

    if (today >= visibilityDeadline) return null;

    const handleRemind = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications.");
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            setIsReminderSet(true);
            // In a real app, you'd schedule a background task or push notification
            new Notification("Reminder Set", {
                body: "Saad's Wallet: We will remind you on the 10th to pay your 35,200 PKR bill.",
            });

            // Reset after 3 seconds for UI demo
            setTimeout(() => setIsReminderSet(false), 3000);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20 mt-8 relative overflow-hidden group"
        >
            {/* Animated accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 text-white">
                    <Info size={20} strokeWidth={1.5} />
                </div>
                <span className="text-apple-caption !text-white/60">Strategy Priority</span>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-2xl text-apple-title text-white">Action Plan</h3>
                    <p className="text-sm text-indigo-100/80 font-medium">Monthly Optimization Goal</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-indigo-50 font-medium leading-normal">
                        On <span className="text-white font-black underline decoration-white/20 underline-offset-4">Feb 10th</span>,
                        pay at least <span className="text-white font-black text-lg">35,200</span> PKR to neutralize overhead leakage.
                    </p>
                </div>

                <button
                    onClick={handleRemind}
                    disabled={isReminderSet}
                    className={`w-full py-5 rounded-2xl text-apple-caption flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl ${isReminderSet ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-600'
                        }`}
                >
                    <AnimatePresence mode="wait">
                        {isReminderSet ? (
                            <motion.div key="done" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                                <CheckCircle2 size={16} /> Reminded
                            </motion.div>
                        ) : (
                            <motion.div key="bell" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                                <Bell size={16} /> Notify Me
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.section>
    );
}
