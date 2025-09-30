# Multi-Agent Chatbot Frontend (Angular)

Ocean Professional themed Angular app providing:
- Modern chat interface
- Agents sidebar selection
- Chat history
- Preferences management
- Document upload/list/delete
- Authentication (login/signup)
- REST API integration with backend

## Quickstart (Dev)

1) Ensure the backend is running and accessible. Set the API base URL:
   - By default, the app uses `http://localhost:8000` (see `src/environments/environment.ts`).
   - For other environments, set a global variable in index.html or inject at runtime:
     ```
     <script>window.__BACKEND_API_BASE_URL__='https://your-backend';</script>
     ```

2) Install and start:
```bash
npm install
npm start
```
Visit http://localhost:3000

## Environment and Configuration

- API base URL is read from `window.__BACKEND_API_BASE_URL__` if present, otherwise defaults to `http://localhost:8000`.
- Authentication tokens are stored in `localStorage` under `accessToken`.

## Routes

- /auth: login/signup
- /chat: main chat interface
- /history: chat sessions
- /preferences: configure preferences
- /documents: manage RAG documents
- Sidebar named outlet: `(sidebar:agents)` provides agent selection panel; automatically present in layout.

## Notes

- This app expects backend REST endpoints:
  - POST /auth/login, POST /auth/signup, GET /auth/me
  - GET /agents
  - POST /chat/send, GET /chat/history, GET /chat/{id}/messages
  - GET /preferences, PUT /preferences/{key}
  - POST /documents/upload, GET /documents, DELETE /documents/{id}

If your backend differs, update `src/app/services/api.service.ts`.

