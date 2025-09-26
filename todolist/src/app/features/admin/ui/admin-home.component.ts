import { Component, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { TodoStore } from '../../todos/data/todo.store';
import { ApiService } from '../../../core/services/api.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
standalone: true,
imports: [NgFor, FormsModule],
template: `
<h2 class="text-2xl font-bold mb-4">Administration</h2>

<button class="px-3 py-1 rounded bg-blue-600 text-white mb-4" (click)="syncTodos()">
Synchroniser les tâches (API simulée)
  </button>

  <section class="mb-6">
    <h3 class="font-semibold mb-2">Utilisateurs</h3>
    <div class="grid md:grid-cols-2 gap-2">
      <div *ngFor="let u of users" class="border rounded p-3 flex items-center justify-between">
        <div>
          <div class="font-semibold">{{ u.email }}</div>
          <div class="text-sm text-gray-600">Rôle : {{ u.role }}</div>
        </div>
        <div class="flex gap-2">
          <button class="px-2 py-1 rounded bg-gray-200" (click)="setRole(u.id, 'user')">Rendre utilisateur</button>
          <button class="px-2 py-1 rounded bg-gray-800 text-white" (click)="setRole(u.id, 'admin')">Rendre admin</button>
          <button class="px-2 py-1 rounded bg-red-600 text-white"
                  [disabled]="isSelf(u.id)"
                  title="{{ isSelf(u.id) ? 'Vous ne pouvez pas supprimer votre propre compte' : 'Supprimer l’utilisateur' }}"
                  (click)="confirmDelete(u.id)">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </section>

  <section>
    <h3 class="font-semibold mb-2">Projets</h3>
    <form (submit)="addProject()" class="flex gap-2 mb-3">
      <input [(ngModel)]="projectName" name="projectName" class="input" placeholder="Nom du projet" />
      <button class="btn-primary">Ajouter</button>
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
  private errs = inject(ErrorService);

  users = this.auth.listUsers();
  projectName = '';
  projects = signal(this.store.listProjects());

  isSelf = (id: string) => this.auth.currentUser()?.id === id;

  setRole(userId: string, role: 'user' | 'admin') {
    try {
      this.auth.setRole(userId, role);
      this.users = this.auth.listUsers();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Impossible de changer le rôle';
      this.errs.push(msg);
    }
  }

  addProject() {
    if (!this.projectName.trim()) return;
    this.store.addProject(this.projectName.trim());
    this.projectName = '';
    this.projects.set(this.store.listProjects());
  }

  confirmDelete(userId: string) {
    const ok = confirm('Supprimer cet utilisateur et toutes ses tâches ?');
    if (!ok) return;
    try {
      this.store.removeByOwner(userId);
      this.auth.deleteUser(userId);
      this.users = this.auth.listUsers();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Suppression impossible';
      this.errs.push(msg);
    }
  }

  syncTodos() {
    this.api.fetchTodos().subscribe(todos => {
      console.log('Tâches récupérées depuis l’API simulée :', todos.length);
    });
  }
}
