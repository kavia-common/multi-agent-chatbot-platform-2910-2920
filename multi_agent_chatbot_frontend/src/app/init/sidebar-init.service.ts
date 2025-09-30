import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
PUBLIC_INTERFACE
*/
@Injectable({ providedIn: 'root' })
export class SidebarInitService {
  private router = inject(Router);

  /**
   * Initialize sidebar outlet with Agents component on first navigation into the app shell.
   */
  // PUBLIC_INTERFACE
  init() {
    const sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const tree = this.router.createUrlTree([], {
          relativeTo: this.router.routerState.root,
          queryParamsHandling: 'preserve',
          preserveFragment: true
        });
        // If no sidebar outlet active, activate agents
        const hasSidebar = this.router.isActive(this.router.createUrlTree([{ outlets: { sidebar: ['agents'] } }]), false);
        if (!hasSidebar) {
          this.router.navigate([{ outlets: { sidebar: ['agents'] } }], { queryParamsHandling: 'preserve' });
        }
        sub.unsubscribe();
      });
  }
}
