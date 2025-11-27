"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'todos.json');

export type TodoType = 'shopping' | 'todo';

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    type: TodoType;
    createdAt: number;
}

async function ensureDb() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }

    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify([]));
    }
}

async function readDb(): Promise<Todo[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

async function writeDb(todos: Todo[]) {
    await ensureDb();
    await fs.writeFile(DB_PATH, JSON.stringify(todos, null, 2));
}

export async function getTodos(): Promise<Todo[]> {
    return readDb();
}

export async function addTodo(text: string, type: TodoType) {
    const todos = await readDb();
    const newTodo: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        type,
        createdAt: Date.now(),
    };

    todos.push(newTodo);
    await writeDb(todos);
    revalidatePath('/');
    return newTodo;
}

export async function toggleTodo(id: string) {
    const todos = await readDb();
    const todo = todos.find(t => t.id === id);

    if (todo) {
        todo.completed = !todo.completed;
        await writeDb(todos);
        revalidatePath('/');
    }
}

export async function deleteTodo(id: string) {
    let todos = await readDb();
    todos = todos.filter(t => t.id !== id);
    await writeDb(todos);
    revalidatePath('/');
}
