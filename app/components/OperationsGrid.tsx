"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Container } from '../../actions/docker';
import ContainerCard from './ContainerCard';

interface OperationsGridProps {
    initialContainers: Container[];
}

const OperationsGrid = ({ initialContainers }: OperationsGridProps) => {
    const [containers, setContainers] = useState<Container[]>(initialContainers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh every 5 seconds
    useEffect(() => {
        const fetchContainers = async () => {
            setIsRefreshing(true);
            try {
                const response = await fetch('/api/containers');
                const data = await response.json();
                setContainers(data);
            } catch (error) {
                console.error('Failed to refresh containers:', error);
            } finally {
                setIsRefreshing(false);
            }
        };

        const interval = setInterval(fetchContainers, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdate = () => {
        setIsRefreshing(true);
        fetch('/api/containers')
            .then(res => res.json())
            .then(data => setContainers(data))
            .catch(err => console.error('Failed to refresh containers:', err))
            .finally(() => setIsRefreshing(false));
    };

    const filteredContainers = containers.filter(container =>
        container.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.image.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search containers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-4 py-3 pl-11 text-slate-200 placeholder-slate-500 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                />
                {isRefreshing && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Container Grid */}
            {filteredContainers.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="text-slate-500 text-sm">
                        {searchQuery ? 'No containers found matching your search.' : 'No containers found.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredContainers.map((container) => (
                        <ContainerCard
                            key={container.id}
                            container={container}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OperationsGrid;
