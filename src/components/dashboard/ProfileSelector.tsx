"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Profile {
    id: string;
    name: string;
    avatar_url: string;
}

interface ProfileSelectorProps {
    profiles: Profile[];
    onSelect: (profile: Profile) => void;
}

const SpringConfig = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function ProfileSelector({ profiles, onSelect }: ProfileSelectorProps) {
    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-white mb-16 tracking-tighter"
            >
                Who's settling today?
            </motion.h1>

            <div className="flex flex-wrap justify-center gap-12 max-w-4xl">
                {profiles.map((profile, index) => (
                    <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...SpringConfig, delay: index * 0.1 }}
                        onClick={() => onSelect(profile)}
                        className="group cursor-pointer flex flex-col items-center gap-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            transition={SpringConfig}
                            className="relative"
                        >
                            {/* Netflix-style Squircle Avatar */}
                            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-transparent group-hover:border-indigo-500 transition-all shadow-2xl overflow-hidden">
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.name}
                                    className="w-full h-full object-cover bg-slate-800"
                                />
                            </div>

                            {/* Hover Shadow */}
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>

                        <span className="text-xl font-bold text-slate-400 group-hover:text-white transition-colors tracking-tight">
                            {profile.name}
                        </span>
                    </motion.div>
                ))}

                {/* Add Profile Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...SpringConfig, delay: profiles.length * 0.1 }}
                    className="group cursor-pointer flex flex-col items-center gap-6"
                >
                    <div className="w-40 h-40 rounded-[2.5rem] border-4 border-dashed border-slate-700 flex items-center justify-center group-hover:border-slate-500 transition-all">
                        <span className="text-4xl text-slate-500 group-hover:text-slate-300 font-light">+</span>
                    </div>
                    <span className="text-xl font-bold text-slate-500 group-hover:text-slate-300 transition-colors tracking-tight">
                        Add User
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
