import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./ui/admin-home.component').then(m => m.AdminHomeComponent) },
];
