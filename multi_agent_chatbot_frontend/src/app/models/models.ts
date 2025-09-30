/**
 * Shared TypeScript interfaces for API contracts and app data models.
 * Keep small and cohesive to avoid circular dependencies.
 */

export type ID = string;

export interface Agent {
  id: ID;
  name: string;
  description?: string;
  role?: string;
  isActive?: boolean;
}

export interface ChatMessage {
  id?: ID;
  chatId?: ID;
  agentId?: ID | null;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string; // ISO string
}

export interface ChatSession {
  id: ID;
  title: string;
  createdAt: string;
  updatedAt?: string;
  agentIds?: ID[];
  lastMessagePreview?: string;
}

export interface Preference {
  key: string;
  value: string | number | boolean;
  label?: string;
  description?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface UserProfile {
  id: ID;
  email: string;
  name?: string;
}

export interface UploadDocumentResponse {
  documentId: ID;
  filename: string;
  size: number;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

/**
PUBLIC_INTERFACE
*/
export interface SendMessageRequest {
  /** Message content from the user */
  content: string;
  /** Optional agent ids to target specific agents in the multi-agent system */
  agentIds?: ID[];
  /** Optional chatId to continue existing session */
  chatId?: ID;
}

/**
PUBLIC_INTERFACE
*/
export interface SendMessageResponse {
  /** Assistant response messages (can be multi-agent) */
  messages: ChatMessage[];
  /** Chat session id (new or existing) */
  chatId: ID;
}
