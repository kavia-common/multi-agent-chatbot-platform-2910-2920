import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ChatSession } from '../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  sessions = signal<ChatSession[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.api.getChatHistory().subscribe({
      next: (page) => {
        this.sessions.set(page.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openSession(id: string) {
    this.router.navigate(['/chat'], { queryParams: { chatId: id } });
  }
}
