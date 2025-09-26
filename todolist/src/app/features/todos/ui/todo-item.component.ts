import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../../core/models';
import { StatusLabelPipe } from '../pipes/status-label.pipe';

@Component({
  standalone: true,
  selector: 'app-todo-item',
  imports: [RouterLink, NgIf, FormsModule, DatePipe, StatusLabelPipe],
  template: `
  <div class="border rounded p-3 flex items-start justify-between">
    <div class="space-y-1">
      <a [routerLink]="['/todos', todo.id]" class="font-semibold hover:underline">{{ todo.title }}</a>
      <div class="text-sm text-gray-600" *ngIf="todo.description">{{ todo.description }}</div>
      <div class="text-xs text-gray-500">
        Status: {{ todo.status | statusLabel }} • {{ todo.createdAt | date:'short' }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <select [(ngModel)]="todo.status" (ngModelChange)="statusChange.emit($event)"
              class="border p-1 rounded" aria-label="Change status">
        <option value="todo">todo</option>
        <option value="doing">doing</option>
        <option value="done">done</option>
      </select>
      <button class="px-2 py-1 bg-gray-200 rounded" (click)="remove.emit()">Delete</button>
    </div>
  </div>
  `
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() statusChange = new EventEmitter<'todo'|'doing'|'done'>();
  @Output() remove = new EventEmitter<void>();
}
