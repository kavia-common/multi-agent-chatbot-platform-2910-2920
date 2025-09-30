import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarInitService } from './init/sidebar-init.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private sidebarInit = inject(SidebarInitService);
  ngOnInit(): void {
    this.sidebarInit.init();
  }
}
