import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TodoStore } from '../data/todo.store';
import { StatusLabelPipe } from '../pipes/status-label.pipe';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, StatusLabelPipe, AutofocusDirective, NgFor, NgIf, DatePipe],
  template: `
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-2xl font-bold">My Todos</h2>
    <div class="text-sm text-gray-600">Total: {{count()}} • Done: {{doneCount()}}</div>
  </div>

  <form (submit)="create()" class="grid md:grid-cols-4 gap-2 mb-4">
    <input appAutofocus [(ngModel)]="title" name="title" class="border p-2 rounded" placeholder="New todo title" required />
    <input [(ngModel)]="description" name="description" class="border p-2 rounded" placeholder="Description (optional)" />
    <select [(ngModel)]="projectId" name="projectId" class="border p-2 rounded">
      <option [ngValue]="undefined">No project</option>
      <option *ngFor="let p of projects()" [value]="p.id">{{p.name}}</option>
    </select>
    <button class="px-4 py-2 bg-green-600 text-white rounded">Add</button>
  </form>

  <div class="flex items-center gap-2 mb-3">
    <input [(ngModel)]="term" name="term" class="border p-2 rounded flex-1" placeholder="Search..." />
    <label class="text-sm flex items-center gap-2">
      <input type="checkbox" [(ngModel)]="onlyMine" name="onlyMine" /> Only my todos
    </label>
  </div>

  <div class="grid gap-2">
    <div *ngFor="let t of filtered()" class="border rounded p-3 flex items-start justify-between">
      <div class="space-y-1">
        <a [routerLink]="['/todos', t.id]" class="font-semibold hover:underline">{{t.title}}</a>
        <div class="text-sm text-gray-600" *ngIf="t.description">{{t.description}}</div>
        <div class="text-xs text-gray-500">Status: {{t.status | statusLabel}} • {{t.createdAt | date:'short'}}</div>
      </div>
      <div class="flex items-center gap-2">
        <select [(ngModel)]="t.status" (ngModelChange)="updateStatus(t.id, $event)" class="border p-1 rounded">
          <option value="todo">todo</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
        <button class="px-2 py-1 bg-gray-200 rounded" (click)="remove(t.id)">Delete</button>
      </div>
    </div>
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
    const mine = this.onlyMine && me ? items.filter(t => t.ownerId === me) : items;
    const q = this.term.toLowerCase();
    return q ? mine.filter(t => t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q)) : mine;
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
