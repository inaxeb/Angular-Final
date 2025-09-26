import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'todos' },
      {
        path: 'todos',
        canActivate: [authGuard],
        loadChildren: () => import('./features/todos/routes').then(m => m.TODO_ROUTES),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./features/admin/routes').then(m => m.ADMIN_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES),
      },
      { path: '**', redirectTo: 'todos' },
    ],
  },
];
