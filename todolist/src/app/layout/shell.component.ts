import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

import { AuthService } from '../core/services/auth.service';
import { LoadingService } from '../core/services/loading.service';
import { ErrorService } from '../core/services/error.service';

@Component({
standalone: true,
selector: 'app-shell',
imports: [RouterLink, RouterOutlet, NgIf],
template: `
<div *ngIf="loading()" class="fixed top-0 left-0 right-0 h-1 bg-blue-600 animate-pulse z-50"></div>

<div *ngIf="error()" class="fixed top-2 right-2 bg-red-600 text-white px-3 py-2 rounded shadow z-50"
role="alert" aria-live="assertive">
{{ error() }}
    <button class="ml-2 underline" (click)="clearError()" aria-label="Close">x</button>
  </div>

  <div class="min-h-screen flex flex-col">
    <header class="border-b p-4 flex items-center justify-between bg-gray-50">
      <h1 class="text-xl font-bold">Todolist Pro</h1>
      <nav class="flex items-center gap-4">
        <a routerLink="/todos" class="hover:underline">Todos</a>
        <a *ngIf="isAdmin()" routerLink="/admin" class="hover:underline">Admin</a>
        <a *ngIf="!isLogged()" routerLink="/auth/login" class="px-3 py-1 rounded bg-blue-600 text-white">Login</a>
        <button *ngIf="isLogged()" (click)="logout()" class="px-3 py-1 rounded bg-gray-800 text-white">Logout</button>
      </nav>
    </header>

    <main class="max-w-5xl mx-auto p-4 w-full">
      <router-outlet />
    </main>

    <footer class="mt-auto p-4 text-center text-sm text-gray-500">
      Angular 20 • Tailwind • Signals
    </footer>
  </div>
  `
})
export class ShellComponent {
  private auth = inject(AuthService);
  private loader = inject(LoadingService);
  private errs = inject(ErrorService);

  readonly isLogged = computed(() => !!this.auth.currentUser());
  readonly isAdmin = computed(() => this.auth.isAdmin());
  readonly loading = computed(() => this.loader.loading());
  readonly error = computed(() => this.errs.message());

  logout() { this.auth.logout(); }
  clearError() { this.errs.clear(); }
}
