import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./ui/login.component').then(m => m.LoginComponent)},
  { path: 'register', loadComponent: () => import('./ui/register.component').then(m => m.RegisterComponent)},
];
