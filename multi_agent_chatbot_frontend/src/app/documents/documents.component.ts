import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { getConfirm } from '../utils/browser-globals';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  private api = inject(ApiService);
  docs = signal<any[]>([]);
  uploading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.api.listDocuments().subscribe({
      next: (list) => this.docs.set(list),
      error: (e) => this.error.set(e.message)
    });
  }

  onFileChange(event: any) {
    const input = event.target as any;
    const file: any = input?.files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.api.uploadDocument(file).subscribe({
      next: () => {
        this.uploading.set(false);
        this.refresh();
      },
      error: (e) => {
        this.error.set(e.message);
        this.uploading.set(false);
      }
    });
    if (input) input.value = '';
  }

  delete(id: string) {
    const c = getConfirm();
    if (c && !c('Delete this document?')) return;
    this.api.deleteDocument(id).subscribe({
      next: () => this.refresh(),
      error: (e) => this.error.set(e.message)
    });
  }
}
