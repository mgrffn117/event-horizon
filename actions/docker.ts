"use server";

import Docker from 'dockerode';

export interface Container {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
    uptime: string;
}

// Helper to create Docker instance with env variable support
function getDockerInstance(): Docker {
    const socketPath = process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock';
    return new Docker({ socketPath });
}

// Get ALL containers (running + stopped)
export async function getContainers(): Promise<Container[]> {
    let docker: Docker;

    try {
        docker = getDockerInstance();
        await docker.ping();
    } catch (error) {
        console.log("Could not connect to unix socket, trying TCP...");
        try {
            docker = new Docker({ host: 'localhost', port: 2375 });
            await docker.ping();
        } catch (tcpError) {
            console.error("Failed to connect to Docker:", tcpError);
            return [];
        }
    }

    try {
        // Get ALL containers (all: true includes stopped ones)
        const containers = await docker.listContainers({ all: true });

        return containers.map(c => {
            const name = c.Names[0]?.replace('/', '') || c.Id.substring(0, 12);

            // Parse uptime from Status
            const uptime = c.Status || 'Unknown';

            return {
                id: c.Id,
                name,
                image: c.Image,
                state: c.State,
                status: c.Status,
                uptime,
            };
        });
    } catch (error) {
        console.error("Error listing containers:", error);
        return [];
    }
}

// Toggle container state (start, stop, restart)
export async function toggleContainer(
    id: string,
    action: 'start' | 'stop' | 'restart'
): Promise<{ success: boolean; error?: string }> {
    let docker: Docker;

    try {
        docker = getDockerInstance();
        await docker.ping();
    } catch (error) {
        try {
            docker = new Docker({ host: 'localhost', port: 2375 });
            await docker.ping();
        } catch (tcpError) {
            console.error("Failed to connect to Docker:", tcpError);
            return { success: false, error: 'Failed to connect to Docker' };
        }
    }

    try {
        const container = docker.getContainer(id);

        switch (action) {
            case 'start':
                await container.start();
                break;
            case 'stop':
                await container.stop();
                break;
            case 'restart':
                await container.restart();
                break;
        }

        return { success: true };
    } catch (error: any) {
        console.error(`Error ${action}ing container:`, error);
        return { success: false, error: error.message || `Failed to ${action} container` };
    }
}

// Legacy function for backward compatibility
export interface ContainerInfo {
    Id: string;
    Names: string[];
    Image: string;
    State: string;
    Status: string;
}

export async function getRunningContainers(): Promise<ContainerInfo[]> {
    const containers = await getContainers();

    return containers
        .filter(c => c.state === 'running')
        .map(c => ({
            Id: c.id,
            Names: [`/${c.name}`],
            Image: c.image,
            State: c.state,
            Status: c.status,
        }));
}
