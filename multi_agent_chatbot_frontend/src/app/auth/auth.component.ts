import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  mode = signal<'login' | 'signup'>('login');
  email = signal<string>('');
  password = signal<string>('');
  name = signal<string>('');
  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  setEmail(v: string) { this.email.set(v); }
  setPassword(v: string) { this.password.set(v); }
  setName(v: string) { this.name.set(v); }

  submit() {
    this.error.set(null);
    this.loading.set(true);
    const email = this.email().trim();
    const password = this.password().trim();

    const obs = this.mode() === 'login'
      ? this.auth.login(email, password)
      : this.auth.signup(email, password, this.name().trim());

    obs.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/chat']);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.message || 'Authentication failed');
      }
    });
  }

  switchMode() {
    this.mode.set(this.mode() === 'login' ? 'signup' : 'login');
    this.error.set(null);
  }
}
