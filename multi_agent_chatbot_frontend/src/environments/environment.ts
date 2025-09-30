import { getWindow } from '../app/utils/browser-globals';

const w = getWindow() as any;

export const environment = {
  production: false,
  // IMPORTANT: Backend API base URL is required via env variable at runtime or via proxy.
  // Use a reverse proxy in deployment or set this during build. For local dev, update as needed.
  apiBaseUrl: (w && w.__BACKEND_API_BASE_URL__) || 'http://localhost:8000',
};
