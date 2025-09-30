import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Agent } from '../models/models';
import { getLocalStorage } from '../utils/browser-globals';

/**
PUBLIC_INTERFACE
*/
@Component({
  selector: 'app-agents-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agents-sidebar.component.html',
  styleUrls: ['./agents-sidebar.component.css']
})
export class AgentsSidebarComponent implements OnInit {
  private api = inject(ApiService);
  agents = signal<Agent[]>([]);
  selectedAgentIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    // Load stored selection
    try {
      const ls = getLocalStorage();
      const raw = ls?.getItem('selectedAgentIds');
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        this.selectedAgentIds.set(new Set(arr));
      }
    } catch { /* ignore */ }

    // Load agents list
    this.api.listAgents().subscribe({
      next: (list) => this.agents.set(list),
      error: (e) => console.error(e)
    });
  }

  toggleAgent(id: string) {
    const current = new Set(this.selectedAgentIds());
    if (current.has(id)) current.delete(id);
    else current.add(id);
    this.selectedAgentIds.set(current);
    const ls = getLocalStorage();
    try { ls?.setItem('selectedAgentIds', JSON.stringify(Array.from(current))); } catch {}
  }

  // PUBLIC_INTERFACE
  isSelected(id: string): boolean {
    return this.selectedAgentIds().has(id);
  }

  // PUBLIC_INTERFACE
  getSelected(): string[] {
    return Array.from(this.selectedAgentIds());
  }
}
