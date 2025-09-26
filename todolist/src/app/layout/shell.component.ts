import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterLink, RouterOutlet, NgIf],
  template: `
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
  readonly isLogged = computed(() => !!this.auth.currentUser());
  readonly isAdmin = computed(() => this.auth.isAdmin());

  logout() { this.auth.logout(); }
}
