# QueueCTL 🚀

**QueueCTL** is a robust command-line interface designed for managing job queues, orchestrating workers, and handling Dead Letter Queues (DLQ) with ease.

-----

## 📋 Prerequisites

> ⚠️ **Important:** Ensure you have **Node.js v24** or later installed on your system before proceeding.

## 🛠️ Installation

To set up QueueCTL locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:5ar1m/QueueCTL.git
    cd QueueCTL
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Link the executable:**
    This will make the `queuectl` command available globally on your system.

    ```bash
    npm link
    ```

-----

## 🏗️ Architecture

<img width="1450" height="1255" alt="queuectl_architecture" src="https://github.com/user-attachments/assets/b6436faf-b853-49f8-809f-84ed81c4d0d4" />


QueueCTL operates by interfacing directly with your underlying queue storage (e.g., sqlite3 database). It allows for decoupled management of job producers (enqueuing) and consumers (workers), while providing a unified view for monitoring system health and handling failed jobs via the DLQ.

-----

## 💻 Usage Guide

Once installed, you can use the `queuectl` command to interact with your queue system.

### 📥 Core Operations

Add new jobs to the queue easily using JSON payloads.

| Action | Command Example | Description |
| :--- | :--- | :--- |
| **Enqueue** | `queuectl enqueue '{"title":"job1","command":"sleep 2"}'` | Add a new job to the queue. |

### 👷 Worker Management

Manage your worker processes directly from the CLI.

```bash
# Start one or more workers (e.g., 3 workers)
queuectl worker start --count 3

# Stop all running workers gracefully
queuectl worker stop
```

### 📊 Monitoring & Status

Keep track of your system's health and job throughput.

| Action | Command Example | Description |
| :--- | :--- | :--- |
| **System Status** | `queuectl status` | Show summary of all job states & active workers. |
| **List Jobs** | `queuectl list --state pending` | List jobs filtered by their current state. |

### 💀 Dead Letter Queue (DLQ)

Manage failed jobs that have exceeded their retry limits.

```bash
# View all jobs currently in the DLQ
queuectl dlq list

# Retry a specific job from the DLQ
queuectl dlq retry job1
```

### ⚙️ Configuration

Manage dynamic configurations such as retry limits, default workers and backoff strategies on the fly.

```bash
# Get current configuration
queuectl config get --max-retries

# Update configuration
queuectl config set --max-retries 3
```

-----

## 🧪 Testing & Development

For local development and testing, you can seed the database with mock data.

1.  Navigate to the project directory.
2.  Run the mock script:
    ```bash
    npm run mock
    ```
    *This will insert fake records into the database for testing various queue states.*
