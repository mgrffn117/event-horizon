"use client";

import React, { useTransition } from 'react';
import { Container as ContainerIcon, RefreshCw, Square, Play } from 'lucide-react';
import { Container } from '../../actions/docker';
import { toggleContainer } from '../../actions/docker';

interface ContainerCardProps {
    container: Container;
    onUpdate: () => void;
}

const ContainerCard = ({ container, onUpdate }: ContainerCardProps) => {
    const [isPending, startTransition] = useTransition();
    const isRunning = container.state === 'running';

    const handleAction = (action: 'start' | 'stop' | 'restart') => {
        startTransition(async () => {
            await toggleContainer(container.id, action);
            onUpdate();
        });
    };

    return (
        <div className={`glass-card p-4 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <ContainerIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                            {container.name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                            {container.image}
                        </p>
                    </div>
                </div>

                {/* Status Dot */}
                <div className={`status-dot ${isRunning ? 'status-running' : 'status-stopped'} flex-shrink-0`}></div>
            </div>

            {/* Status Text */}
            <p className="text-xs text-slate-400 mb-3">{container.status}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleAction('restart')}
                    disabled={isPending}
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 transition-all border border-white/5 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
                </button>

                <button
                    onClick={() => handleAction(isRunning ? 'stop' : 'start')}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 transition-all border border-white/5 disabled:opacity-50"
                >
                    {isRunning ? (
                        <>
                            <Square className="w-4 h-4" />
                            <span>Stop</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            <span>Start</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ContainerCard;
