"use client";

import React from 'react';

interface TactileSliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (val: number) => void;
    criticalTarget: number;
}

export default function TactileSlider({ min, max, value, onChange, criticalTarget }: TactileSliderProps) {
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
        <div className="relative w-full py-4">
            <div className="relative h-12 flex items-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={100}
                    value={value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        // Magnetic snap to target
                        if (Math.abs(val - criticalTarget) < (max - min) * 0.03) {
                            onChange(criticalTarget);
                        } else {
                            onChange(val);
                        }
                    }}
                    style={{ background: getTrackBackground() }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-white transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] bg-slate-800/50"
                />
                {/* Target Marker Shield */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)] pointer-events-none rounded-full"
                    style={{ left: `${thresholdPercentage}%` }}
                />
            </div>

            <div className="flex justify-between mt-2 px-1">
                <div className="flex flex-col">
                    <span className="text-apple-caption vibrant-text">Min</span>
                    <span className="text-xs font-bold text-slate-400">{min.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-apple-caption !text-rose-500/80">Target</span>
                    <span className="text-xs font-black text-rose-500">{criticalTarget.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-apple-caption vibrant-text">Max</span>
                    <span className="text-xs font-bold text-slate-400">{max.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
