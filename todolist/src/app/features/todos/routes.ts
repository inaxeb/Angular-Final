import { Routes } from '@angular/router';

export const TODO_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./ui/todo-page.component').then(m => m.TodoPageComponent) },
  { path: ':id', loadComponent: () => import('./ui/todo-detail.component').then(m => m.TodoDetailComponent) },
];
