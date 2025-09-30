import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { AuthComponent } from './auth/auth.component';
import { ChatComponent } from './chat/chat.component';
import { HistoryComponent } from './history/history.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { DocumentsComponent } from './documents/documents.component';
import { AgentsSidebarComponent } from './agents/agents-sidebar.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'chat' },
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Activate sidebar agents by default alongside main routes
      { path: 'chat', component: ChatComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'preferences', component: PreferencesComponent },
      { path: 'documents', component: DocumentsComponent },
      // Sidebar outlet route
      { path: 'agents', component: AgentsSidebarComponent, outlet: 'sidebar' },
      { path: '**', redirectTo: 'chat' }
    ]
  }
];
