# CypherX Dashboard — Backend Server

Standalone Node.js + Express backend for the CypherX Bot Management Dashboard. It acts as a secure server-side proxy between your frontend (e.g., Next.js on `http://localhost:3000`) and the CypherX Platform API (`https://platform.cypherx.store/api/v1`), keeping your CypherX API key off the client.

## Features

- Express.js REST API using ES Modules
- Centralized CypherX API integration (`src/services/cypherx.service.js`)
- Automatic `Bearer` token injection from server-side environment variables
- Input validation and consistent error responses (`{ "success": false, "message": "..." }`)
- In-memory ZIP upload handling (`multer`, up to 50 MB) forwarded as `multipart/form-data`
- CORS restricted to `CLIENT_URL`
- Graceful shutdown handling

## Installation

1. Navigate to the `server` directory:

   ```bash
   cd "C:\Users\Admin\Desktop\cypher bot api\server"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Environment Setup

Copy `.env.example` to `.env` (already created for local development) and set your CypherX API key:

```env
PORT=5000
CLIENT_URL=http://localhost:3000

CYPHERX_BASE_URL=https://platform.cypherx.store/api/v1
CYPHERX_API_KEY=YOUR_API_KEY_HERE
```

- Never commit `.env` to Git (it is listed in `.gitignore`).
- Never expose `CYPHERX_API_KEY` in frontend code or client responses.

## Running the Server

Development mode (auto-reloads on file changes with `nodemon`):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server starts on `http://localhost:5000` by default.

## Local API Endpoints

| Method | Endpoint | Proxies to CypherX | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | Local server health check |
| `GET` | `/api/account` | `GET /account` | Get CypherX account details |
| `GET` | `/api/bots` | `GET /bots` | List all bots |
| `GET` | `/api/bots/:id` | `GET /bots/:id` | Get a single bot's details |
| `GET` | `/api/bots/:id/logs?lines=100` | `GET /bots/:id/logs?lines=100` | Get bot logs (`lines`: integer `1–10000`, default `100`) |
| `POST` | `/api/bots/:id/restart` | `POST /bots/:id/restart` | Restart a bot |
| `POST` | `/api/bots/:id/stop` | `POST /bots/:id/stop` | Stop a bot |
| `DELETE` | `/api/bots/:id` | `DELETE /bots/:id` | Permanently delete a bot |
| `POST` | `/api/deploy/github` | `POST /deploy/github` | Deploy a bot from a GitHub repository |
| `POST` | `/api/deploy/upload` | `POST /deploy/upload` | Deploy a bot from a `.zip` archive (max 50 MB) |
| `GET` | `/api/deploy/status/:deploymentId` | `GET /deploy/status/:deploymentId` | Check deployment status |

## Example Requests

### Health Check

```bash
curl http://localhost:5000/api/health
```

Response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

### Deploy from GitHub

```bash
curl -X POST http://localhost:5000/api/deploy/github \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/owner/repository",
    "botName": "my-bot",
    "description": "Optional description",
    "nodeVersion": "24",
    "config": []
  }'
```

### Deploy from ZIP

```bash
curl -X POST http://localhost:5000/api/deploy/upload \
  -F "file=@./my-bot.zip" \
  -F "botName=my-bot" \
  -F "description=Uploaded bot" \
  -F "nodeVersion=24" \
  -F 'config=[]'
```

## Connecting a Next.js Frontend

In your Next.js app (running on `http://localhost:3000`), point API requests to `http://localhost:5000/api/...`:

```js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const res = await fetch(`${API_BASE}/bots`);
const data = await res.json();
```

If your frontend runs on a different origin or port, update `CLIENT_URL` in `.env` so CORS allows it.

## Security Considerations

- **Local/Private Use Only:** Dashboard user authentication is not implemented in this backend. Do not expose this server directly to the public internet without adding authentication and rate limiting.
- **API Key Protection:** `CYPHERX_API_KEY` stays strictly on the server and is never returned in API responses or error logs.
- **Input & Upload Limits:** JSON payloads are capped at `1mb`, ZIP uploads are capped at `50 MB` in memory (never saved permanently to disk), and destructive bot deletion only runs on explicit `DELETE /api/bots/:id` requests.

