import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../data/todo.store';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
  <div *ngIf="todo() as t; else notFound" class="space-y-3">
    <h2 class="text-2xl font-bold">Edit: {{t.title}}</h2>
    <label class="block">
      <div class="text-sm">Title</div>
      <input [(ngModel)]="title" class="border p-2 rounded w-full" />
    </label>
    <label class="block">
      <div class="text-sm">Description</div>
      <textarea [(ngModel)]="description" class="border p-2 rounded w-full"></textarea>
    </label>
    <label class="block">
      <div class="text-sm">Due date</div>
      <input type="date" [(ngModel)]="dueDate" class="border p-2 rounded" />
    </label>
    <div class="flex gap-2">
      <button class="px-4 py-2 bg-blue-600 text-white rounded" (click)="save()">Save</button>
      <button class="px-4 py-2 bg-gray-300 rounded" (click)="back()">Back</button>
    </div>
  </div>
  <ng-template #notFound>
    <p class="text-red-600">Todo not found</p>
  </ng-template>
  `
})
export class TodoDetailComponent {
  private route = inject(ActivatedRoute);
  private store = inject(TodoStore);
  private router = inject(Router);

  readonly id = this.route.snapshot.paramMap.get('id')!;
  readonly todo = computed(() => this.store.get(this.id));

  title = this.todo()?.title ?? '';
  description = this.todo()?.description ?? '';
  dueDate = (this.todo()?.dueDate ?? '')?.substring(0,10);

  save() {
    this.store.update(this.id, {
      title: this.title, description: this.description,
      dueDate: this.dueDate ? new Date(this.dueDate).toISOString() : undefined
    });
    this.back();
  }

  back() { this.router.navigateByUrl('/todos'); }
}
