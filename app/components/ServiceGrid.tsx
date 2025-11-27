"use client";

import React from 'react';
import { Box, PlayCircle, StopCircle } from 'lucide-react';
import { ContainerInfo } from '../../actions/docker';

interface ServiceGridProps {
    containers: ContainerInfo[];
}

const ServiceGrid = ({ containers }: ServiceGridProps) => {
    if (containers.length === 0) {
        return (
            <div className="text-center text-neutral-500 mt-10">
                <p>No running containers found.</p>
                <p className="text-sm mt-2">Make sure Docker is running and accessible.</p>
            </div>
        );
    }

    // Bento box layout with varying sizes
    const getBentoClass = (index: number) => {
        const patterns = [
            'col-span-2 row-span-2', // Large
            'col-span-1 row-span-1', // Small
            'col-span-1 row-span-2', // Tall
            'col-span-2 row-span-1', // Wide
            'col-span-1 row-span-1', // Small
            'col-span-1 row-span-1', // Small
        ];
        return patterns[index % patterns.length];
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4 p-6 w-full max-w-7xl">
            {containers.map((container, index) => {
                const name = container.Names[0]?.replace('/', '') || container.Id.substring(0, 12);
                const isUp = container.State === 'running';
                const bentoClass = getBentoClass(index);

                return (
                    <div
                        key={container.Id}
                        className={`group glass glass-hover ${bentoClass} rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:scale-[1.02] ${isUp ? 'hover:glow-green' : 'hover:glow-red'
                            }`}
                    >
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-neutral-800/50 rounded-xl backdrop-blur-sm group-hover:bg-neutral-700/50 transition-colors">
                                    <Box className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${isUp
                                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                                        : 'bg-red-900/30 text-red-400 border border-red-500/30'
                                    }`}>
                                    {isUp ? <PlayCircle size={12} /> : <StopCircle size={12} />}
                                    {container.State}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-neutral-200 group-hover:text-white truncate mb-2" title={name}>
                                    {name}
                                </h3>
                                <p className="text-sm text-neutral-500 truncate mb-3" title={container.Image}>
                                    {container.Image}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-600">
                            <span className="truncate max-w-[60%]">{container.Status}</span>
                            <span className="font-mono text-neutral-500">{container.Id.substring(0, 8)}</span>
                        </div>

                        {/* Subtle shine effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 group-hover:animate-shine" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ServiceGrid;
