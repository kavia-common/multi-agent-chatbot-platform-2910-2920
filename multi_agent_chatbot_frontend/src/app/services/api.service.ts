import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  Agent,
  ApiResponse,
  AuthTokens,
  ChatMessage,
  ChatSession,
  Paginated,
  Preference,
  SendMessageRequest,
  SendMessageResponse,
  UploadDocumentResponse,
  UserProfile
} from '../models/models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { getLocalStorage, getWindow } from '../utils/browser-globals';

/**
PUBLIC_INTERFACE
*/
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  private authHeaders(): HttpHeaders {
    const ls = getLocalStorage();
    const token = ls?.getItem('accessToken') || '';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  // PUBLIC_INTERFACE
  login(email: string, password: string): Observable<AuthTokens> {
    return this.http
      .post<ApiResponse<AuthTokens>>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(map((res: ApiResponse<AuthTokens>) => res.data), this.handleError<AuthTokens>()) as Observable<AuthTokens>;
  }

  // PUBLIC_INTERFACE
  signup(email: string, password: string, name?: string): Observable<AuthTokens> {
    return this.http
      .post<ApiResponse<AuthTokens>>(`${this.baseUrl}/auth/signup`, { email, password, name })
      .pipe(map((res: ApiResponse<AuthTokens>) => res.data), this.handleError<AuthTokens>()) as Observable<AuthTokens>;
  }

  // PUBLIC_INTERFACE
  me(): Observable<UserProfile> {
    return this.http
      .get<ApiResponse<UserProfile>>(`${this.baseUrl}/auth/me`, { headers: this.authHeaders() })
      .pipe(map((res: ApiResponse<UserProfile>) => res.data), this.handleError<UserProfile>()) as Observable<UserProfile>;
  }

  /** Agents */
  // PUBLIC_INTERFACE
  listAgents(): Observable<Agent[]> {
    return this.http
      .get<ApiResponse<Agent[]>>(`${this.baseUrl}/agents`, { headers: this.authHeaders() })
      .pipe(map((res: ApiResponse<Agent[]>) => res.data), this.handleError<Agent[]>()) as Observable<Agent[]>;
  }

  /** Chat */
  // PUBLIC_INTERFACE
  sendMessage(payload: SendMessageRequest): Observable<SendMessageResponse> {
    return this.http
      .post<ApiResponse<SendMessageResponse>>(`${this.baseUrl}/chat/send`, payload, { headers: this.authHeaders() })
      .pipe(map((res: ApiResponse<SendMessageResponse>) => res.data), this.handleError<SendMessageResponse>()) as Observable<SendMessageResponse>;
  }

  // PUBLIC_INTERFACE
  getChatHistory(page = 1, size = 20): Observable<Paginated<ChatSession>> {
    const params = { page, size } as any;
    return this.http
      .get<ApiResponse<Paginated<ChatSession>>>(`${this.baseUrl}/chat/history`, {
        headers: this.authHeaders(),
        params
      })
      .pipe(map((res: ApiResponse<Paginated<ChatSession>>) => res.data), this.handleError<Paginated<ChatSession>>()) as Observable<Paginated<ChatSession>>;
  }

  // PUBLIC_INTERFACE
  getChatMessages(chatId: string): Observable<ChatMessage[]> {
    return this.http
      .get<ApiResponse<ChatMessage[]>>(`${this.baseUrl}/chat/${encodeURIComponent(chatId)}/messages`, {
        headers: this.authHeaders()
      })
      .pipe(map((res: ApiResponse<ChatMessage[]>) => res.data), this.handleError<ChatMessage[]>()) as Observable<ChatMessage[]>;
  }

  /** Preferences */
  // PUBLIC_INTERFACE
  listPreferences(): Observable<Preference[]> {
    return this.http
      .get<ApiResponse<Preference[]>>(`${this.baseUrl}/preferences`, { headers: this.authHeaders() })
      .pipe(map((res: ApiResponse<Preference[]>) => res.data), this.handleError<Preference[]>()) as Observable<Preference[]>;
  }

  // PUBLIC_INTERFACE
  updatePreference(key: string, value: Preference['value']): Observable<Preference> {
    return this.http
      .put<ApiResponse<Preference>>(`${this.baseUrl}/preferences/${encodeURIComponent(key)}`, { value }, { headers: this.authHeaders() })
      .pipe(map((res: ApiResponse<Preference>) => res.data), this.handleError<Preference>()) as Observable<Preference>;
  }

  /** Documents (RAG) */
  // PUBLIC_INTERFACE
  uploadDocument(file: any): Observable<UploadDocumentResponse> {
    // SSR-safe FormData
    const w = getWindow();
    const FD: any = w?.FormData ? w.FormData : (typeof (globalThis as any).FormData !== 'undefined' ? (globalThis as any).FormData : undefined);
    const formData = FD ? new FD() : new (function FallbackFormData(this: any) {
      this._ = [];
      this.append = function (k: string, v: any) { this._.push([k, v]); };
    } as any)();

    formData.append('file', file as any);
    const ls = getLocalStorage();
    const token = ls?.getItem('accessToken') || '';
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http
      .post<ApiResponse<UploadDocumentResponse>>(`${this.baseUrl}/documents/upload`, formData as any, { headers })
      .pipe(map((res: ApiResponse<UploadDocumentResponse>) => res.data), this.handleError<UploadDocumentResponse>()) as Observable<UploadDocumentResponse>;
  }

  // PUBLIC_INTERFACE
  listDocuments(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/documents`, { headers: this.authHeaders() })
      .pipe(map((res: ApiResponse<any[]>) => res.data), this.handleError<any[]>()) as Observable<any[]>;
  }

  // PUBLIC_INTERFACE
  deleteDocument(id: string): Observable<{ deleted: boolean }> {
    return this.http
      .delete<ApiResponse<{ deleted: boolean }>>(`${this.baseUrl}/documents/${encodeURIComponent(id)}`, { headers: this.authHeaders() })
      .pipe(map((res: ApiResponse<{ deleted: boolean }>) => res.data), this.handleError<{ deleted: boolean }>()) as Observable<{ deleted: boolean }>;
  }

  private handleError<T>() {
    return catchError((err: HttpErrorResponse) => {
      console.error('API error:', err);
      let message = 'Unexpected error';
      try {
        message = (err.error && (err.error.message || err.error.detail)) || err.statusText || message;
      } catch { /* ignore */ }
      return throwError(() => new Error(message)) as Observable<T>;
    });
  }
}
