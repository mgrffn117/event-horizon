"use server";

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface StorageStats {
    total: string;
    used: string;
    free: string;
    percent: number;
}

export async function getStorageStats(): Promise<StorageStats | null> {
    const storagePath = process.env.STORAGE_PATH || '/';

    try {
        // Execute df -h to get disk usage
        // Output format: Filesystem Size Used Avail Use% Mounted on
        const { stdout } = await execAsync(`df -h ${storagePath}`);

        // Parse the second line (first line is headers)
        const lines = stdout.trim().split('\n');
        if (lines.length < 2) return null;

        const parts = lines[1].replace(/\s+/g, ' ').split(' ');

        // df -h output columns:
        // 0: Filesystem
        // 1: Size
        // 2: Used
        // 3: Avail (Free)
        // 4: Use%
        // 5: Mounted on

        if (parts.length < 5) return null;

        const total = parts[1];
        const used = parts[2];
        const free = parts[3];
        const percentStr = parts[4].replace('%', '');
        const percent = parseInt(percentStr, 10);

        return {
            total,
            used,
            free,
            percent
        };
    } catch (error) {
        console.error('Error fetching storage stats:', error);
        return null;
    }
}
