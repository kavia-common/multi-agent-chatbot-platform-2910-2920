import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ChatMessage, SendMessageRequest } from '../models/models';
import { AgentsSidebarComponent } from '../agents/agents-sidebar.component';
import { getDocument, getLocalStorage, getSetTimeout } from '../utils/browser-globals';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private api = inject(ApiService);

  messages = signal<ChatMessage[]>([]);
  composer = signal<string>('');
  loading = signal<boolean>(false);
  chatId = signal<string | null>(null);

  @ViewChild(AgentsSidebarComponent) agentsSidebar?: AgentsSidebarComponent;

  ngOnInit(): void {}

  setComposer(val: string) {
    this.composer.set(val);
  }

  async send() {
    const content = this.composer().trim();
    if (!content || this.loading()) return;

    const selectedAgentIds: string[] = (() => {
      try {
        const ls = getLocalStorage();
        const stored = ls?.getItem('selectedAgentIds') ?? '[]';
        return JSON.parse(stored);
      } catch { return []; }
    })();

    const payload: SendMessageRequest = {
      content,
      agentIds: selectedAgentIds,
      chatId: this.chatId() ?? undefined
    };

    // optimistic UI
    this.messages.update((msgs) => [
      ...msgs,
      { sender: 'user', content, createdAt: new Date().toISOString() }
    ]);
    this.composer.set('');
    this.loading.set(true);

    this.api.sendMessage(payload).subscribe({
      next: (res) => {
        this.chatId.set(res.chatId);
        this.messages.update((msgs) => [...msgs, ...res.messages]);
        this.loading.set(false);
        const st = getSetTimeout();
        st?.(() => this.scrollToBottom(), 10);
      },
      error: (e) => {
        this.loading.set(false);
        this.messages.update((msgs) => [
          ...msgs,
          { sender: 'system', content: `Error: ${e.message}`, createdAt: new Date().toISOString() }
        ]);
      }
    });
  }

  private scrollToBottom() {
    const doc = getDocument();
    const el = doc?.querySelector('.messages') as HTMLElement | undefined;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
