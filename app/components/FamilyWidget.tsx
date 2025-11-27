"use client";

import React, { useState, useTransition } from 'react';
import { CheckCircle2, Circle, Trash2, ShoppingCart, ListTodo, Plus } from 'lucide-react';
import { Todo, TodoType, addTodo, toggleTodo, deleteTodo } from '../../actions/todos';

interface FamilyWidgetProps {
    initialTodos: Todo[];
}

const FamilyWidget = ({ initialTodos }: FamilyWidgetProps) => {
    const [activeTab, setActiveTab] = useState<TodoType>('shopping');
    const [inputValue, setInputValue] = useState('');
    const [isPending, startTransition] = useTransition();

    const filteredTodos = initialTodos.filter(t => t.type === activeTab);

    // Sort: Incomplete first, then by creation date (newest first)
    filteredTodos.sort((a, b) => {
        if (a.completed === b.completed) {
            return b.createdAt - a.createdAt;
        }
        return a.completed ? 1 : -1;
    });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const text = inputValue;
        setInputValue(''); // Optimistic clear

        startTransition(async () => {
            await addTodo(text, activeTab);
        });
    };

    const handleToggle = (id: string) => {
        startTransition(async () => {
            await toggleTodo(id);
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteTodo(id);
        });
    };

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            {/* Header & Tabs */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setActiveTab('shopping')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'shopping'
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Shopping</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('todo')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'todo'
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <ListTodo className="w-4 h-4" />
                        <span>To-Do</span>
                    </button>
                </div>
            </div>

            {/* Input */}
            <form onSubmit={handleAdd} className="relative mb-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Add to ${activeTab === 'shopping' ? 'Shopping List' : 'To-Do List'}...`}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isPending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 rounded-md transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </form>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 min-h-[200px] max-h-[400px]">
                {filteredTodos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8">
                        <p className="text-sm">List is empty</p>
                    </div>
                ) : (
                    filteredTodos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`group flex items-center gap-3 p-3 rounded-lg border border-white/5 transition-all ${todo.completed ? 'bg-slate-900/30 opacity-60' : 'bg-slate-800/30 hover:bg-slate-800/50'
                                }`}
                        >
                            <button
                                onClick={() => handleToggle(todo.id)}
                                className={`flex-shrink-0 transition-colors ${todo.completed ? 'text-cyan-500' : 'text-slate-500 hover:text-cyan-400'
                                    }`}
                            >
                                {todo.completed ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                            </button>

                            <span className={`flex-1 text-sm ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                                }`}>
                                {todo.text}
                            </span>

                            <button
                                onClick={() => handleDelete(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FamilyWidget;
