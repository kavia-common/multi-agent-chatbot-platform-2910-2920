import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Preference } from '../models/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  private api = inject(ApiService);
  prefs = signal<Preference[]>([]);
  saving = signal<boolean>(false);

  ngOnInit(): void {
    this.api.listPreferences().subscribe({
      next: (list) => this.prefs.set(list),
      error: (e) => console.error(e)
    });
  }

  save(pref: Preference) {
    this.saving.set(true);
    this.api.updatePreference(pref.key, pref.value).subscribe({
      next: (p) => {
        this.prefs.update(arr => arr.map(x => x.key === p.key ? p : x));
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }
}
