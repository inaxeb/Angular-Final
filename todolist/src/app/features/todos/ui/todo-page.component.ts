import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { TodoStore } from '../data/todo.store';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { AuthService } from '../../../core/services/auth.service';

import { SearchTodosPipe } from '../pipes/search.pipe';
import { TodoItemComponent } from './todo-item.component';

@Component({
standalone: true,
imports: [
FormsModule, NgFor, NgIf, AutofocusDirective,
SearchTodosPipe, TodoItemComponent
],
template: `
<div class="flex items-center justify-between mb-4">
<h2 class="text-2xl font-bold">Mes tâches</h2>
<div class="text-sm text-gray-600">Total : {{count()}} • Terminé : {{doneCount()}}</div>
  </div>

  <form (submit)="create()" class="grid md:grid-cols-4 gap-2 mb-4">
    <input appAutofocus [(ngModel)]="title" name="title" class="input" placeholder="Titre de la tâche" required />
    <input [(ngModel)]="description" name="description" class="input" placeholder="Description (optionnel)" />
    <select [(ngModel)]="projectId" name="projectId" class="select">
      <option [ngValue]="undefined">Aucun projet</option>
      <option *ngFor="let p of projects()" [value]="p.id">{{p.name}}</option>
    </select>
    <button class="btn-primary">Ajouter</button>
  </form>

  <div class="flex items-center gap-2 mb-3">
    <input [(ngModel)]="term" name="term" class="input flex-1" placeholder="Rechercher..." />
    <label class="text-sm flex items-center gap-2">
      <input type="checkbox" [(ngModel)]="onlyMine" name="onlyMine" /> Mes tâches uniquement
    </label>
  </div>

  <div class="grid gap-2">
    <app-todo-item
      *ngFor="let t of (filtered() | searchTodos: term)"
      [todo]="t"
      (statusChange)="updateStatus(t.id, $event)"
      (remove)="remove(t.id)">
    </app-todo-item>
  </div>
  `
})
export class TodoPageComponent {
  private store = inject(TodoStore);
  private auth = inject(AuthService);

  title = '';
  description = '';
  projectId: string | undefined;
  term = '';
  onlyMine = false;

  readonly count = computed(() => this.store.count());
  readonly doneCount = computed(() => this.store.doneCount());
  readonly projects = computed(() => this.store.listProjects());

  private base = computed(() => this.store.list());

  filtered = computed(() => {
    const me = this.auth.currentUser()?.id;
    const items = this.base();
    return this.onlyMine && me ? items.filter(t => t.ownerId === me) : items;
  });

  create() {
    if (!this.title.trim()) return;
    const me = this.auth.currentUser()!;
    this.store.add({
      title: this.title.trim(),
      description: this.description?.trim(),
      projectId: this.projectId,
      status: 'todo',
      dueDate: undefined,
      ownerId: me.id,
    });
    this.title = ''; this.description = '';
  }

  updateStatus(id: string, status: 'todo' | 'doing' | 'done') {
    this.store.update(id, { status });
  }

  remove(id: string) { this.store.remove(id); }
}
