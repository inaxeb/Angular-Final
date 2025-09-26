import { Component, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { TodoStore } from '../../todos/data/todo.store';
import { ApiService } from '../../../core/services/api.service';

@Component({
standalone: true,
imports: [NgFor, FormsModule],
template: `
<h2 class="text-2xl font-bold mb-4">Admin</h2>

<button class="px-3 py-1 rounded bg-blue-600 text-white mb-4" (click)="syncTodos()">
Sync todos (mock API)
  </button>

  <section class="mb-6">
    <h3 class="font-semibold mb-2">Users</h3>
    <div class="grid md:grid-cols-2 gap-2">
      <div *ngFor="let u of users" class="border rounded p-3 flex items-center justify-between">
        <div>
          <div class="font-semibold">{{ u.email }}</div>
          <div class="text-sm text-gray-600">Role: {{ u.role }}</div>
        </div>
        <div class="flex gap-2">
          <button class="px-2 py-1 rounded bg-gray-200" (click)="setRole(u.id, 'user')">Set user</button>
          <button class="px-2 py-1 rounded bg-gray-800 text-white" (click)="setRole(u.id, 'admin')">Set admin</button>
        </div>
      </div>
    </div>
  </section>

  <section>
    <h3 class="font-semibold mb-2">Projects</h3>
    <form (submit)="addProject()" class="flex gap-2 mb-3">
      <input [(ngModel)]="projectName" name="projectName" class="border p-2 rounded" placeholder="New project name" />
      <button class="px-3 py-1 rounded bg-green-600 text-white">Add</button>
    </form>
    <ul class="list-disc pl-6">
      <li *ngFor="let p of projects()">{{ p.name }}</li>
    </ul>
  </section>
  `
})
export class AdminHomeComponent {
  private auth = inject(AuthService);
  private store = inject(TodoStore);
  private api = inject(ApiService);

  users = this.auth.listUsers();
  projectName = '';
  projects = signal(this.store.listProjects());

  setRole(userId: string, role: 'user' | 'admin') {
    this.auth.setRole(userId, role);
    this.users = this.auth.listUsers();
  }

  addProject() {
    if (!this.projectName.trim()) return;
    this.store.addProject(this.projectName.trim());
    this.projectName = '';
    this.projects.set(this.store.listProjects());
  }

  syncTodos() {
    this.api.fetchTodos().subscribe(todos => {
      console.log('Fetched todos from mock API:', todos.length);
    });
  }
}
