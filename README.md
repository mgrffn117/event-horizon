# Event Horizon

## Project Overview

Event Horizon is a comprehensive system monitoring and dashboard application built with Next.js. It serves as a central hub for managing Docker containers and monitoring system resources.

Key features include:
- **Docker Management**: View, start, stop, and restart Docker containers.
- **System Monitoring**: Monitor disk usage and storage statistics.
- **Personal Dashboard**: Includes widgets for local weather, AI news feed, and a family todo list.
- **Service Launcher**: Quick access links to other self-hosted services (configurable via `config.json`).

## Getting Started

To get the project up and running on your local machine, follow these steps:

1.  **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

2.  **Run the development server**:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The following environment variables can be configured to customize the application's behavior. Create a `.env.local` file in the root directory to set these variables.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DOCKER_SOCKET_PATH` | Path to the Docker socket for container management. | `/var/run/docker.sock` |
| `STORAGE_PATH` | Path to the filesystem mount point for monitoring disk usage. | `/` |
| `PIHOLE_API_KEY` | API Key for Pi-hole integration (if applicable). | - |
| `NODE_ENV` | The environment the application is running in (e.g., `production`, `development`). | `development` (locally) |

### Note on Docker
When running this application inside a Docker container (as seen in `docker-compose.yml`), ensure you mount the Docker socket so the dashboard can interact with the host's Docker daemon:

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

### Configuration
You can customize the service launcher links by editing the `config.json` file in the root directory.
