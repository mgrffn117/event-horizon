import React from 'react';
import { HardDrive } from 'lucide-react';
import { StorageStats } from '../../actions/system';

interface StorageWidgetProps {
    stats: StorageStats | null;
}

const StorageWidget = ({ stats }: StorageWidgetProps) => {
    if (!stats) return null;

    const { percent, free, total } = stats;

    // Determine color based on usage
    let progressBarColor = 'bg-cyan-400';
    let isPulsing = false;

    if (percent > 90) {
        progressBarColor = 'bg-red-500';
        isPulsing = true;
    } else if (percent > 70) {
        progressBarColor = 'bg-orange-400';
    }

    return (
        <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                        <HardDrive className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">Storage Capacity</h3>
                        <p className="text-xs text-slate-500">Local Disk</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-white">{free}</span>
                    <span className="text-sm text-slate-500 ml-1">Free</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${progressBarColor} ${isPulsing ? 'animate-pulse' : ''}`}
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{percent}% Used</span>
                <span>{total} Total</span>
            </div>
        </div>
    );
};

export default StorageWidget;
