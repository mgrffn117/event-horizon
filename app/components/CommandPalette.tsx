"use client";

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Container, Folder, RefreshCw, Terminal } from 'lucide-react';
import { ContainerInfo } from '../../actions/docker';

interface CommandPaletteProps {
    containers: ContainerInfo[];
}

const CommandPalette = ({ containers }: CommandPaletteProps) => {
    const [open, setOpen] = useState(false);

    // Toggle command palette with Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] px-4"
            onClick={() => setOpen(false)}
        >
            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                onClick={(e) => e.stopPropagation()}
                className="animate-in fade-in slide-in-from-top-2"
            >
                <Command.Input
                    placeholder="Type a command or search..."
                    autoFocus
                />
                <Command.List>
                    <Command.Empty>No results found.</Command.Empty>

                    {containers.length > 0 && (
                        <Command.Group heading="Containers">
                            {containers.map((container) => {
                                const name = container.Names[0]?.replace('/', '') || container.Id.substring(0, 12);
                                const isRunning = container.State === 'running';

                                return (
                                    <Command.Item
                                        key={container.Id}
                                        value={name}
                                        onSelect={() => {
                                            // You can add navigation or actions here
                                            console.log('Selected container:', name);
                                            setOpen(false);
                                        }}
                                    >
                                        <Container size={16} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span>{name}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${isRunning
                                                        ? 'bg-green-900/30 text-green-400'
                                                        : 'bg-red-900/30 text-red-400'
                                                    }`}>
                                                    {container.State}
                                                </span>
                                            </div>
                                            <div className="text-xs text-neutral-500 mt-1">{container.Image}</div>
                                        </div>
                                    </Command.Item>
                                );
                            })}
                        </Command.Group>
                    )}

                    <Command.Separator />

                    <Command.Group heading="Actions">
                        <Command.Item
                            onSelect={() => {
                                window.location.reload();
                                setOpen(false);
                            }}
                        >
                            <RefreshCw size={16} />
                            <span>Refresh Dashboard</span>
                            <kbd className="ml-auto text-xs px-2 py-1 bg-neutral-800 rounded">⌘R</kbd>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => {
                                console.log('View all containers');
                                setOpen(false);
                            }}
                        >
                            <Folder size={16} />
                            <span>View All Containers</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => {
                                window.open('https://docs.docker.com/', '_blank');
                                setOpen(false);
                            }}
                        >
                            <Terminal size={16} />
                            <span>Docker Documentation</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command.Dialog>
        </div>
    );
};

export default CommandPalette;
