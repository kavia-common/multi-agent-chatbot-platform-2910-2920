import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  sidebarOpen = signal(true);
  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }
}
