import { Injectable, computed, effect, signal } from '@angular/core';
import { Todo, TodoStatus, Project } from '../../../core/models';
import { v4 as uuid } from 'uuid';
import { storage } from '../../../core/storage';

const TODOS_KEY = 'app_todos';
const PROJECTS_KEY = 'app_projects';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  private todos = signal<Todo[]>(storage.get<Todo[]>(TODOS_KEY, []));
  private projects = signal<Project[]>(storage.get<Project[]>(PROJECTS_KEY, [
    { id: uuid(), name: 'General' },
    { id: uuid(), name: 'School' },
  ]));

  private persistTodos = effect(() => storage.set(TODOS_KEY, this.todos()));
  private persistProjects = effect(() => storage.set(PROJECTS_KEY, this.projects()));

  readonly count = computed(() => this.todos().length);
  readonly doneCount = computed(() => this.todos().filter(t => t.status === 'done').length);

  list() { return this.todos(); }
  listProjects() { return this.projects(); }

  add(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTodo: Todo = { ...todo, id: uuid(), createdAt: now, updatedAt: now };
    this.todos.set([newTodo, ...this.todos()]);
  }

  update(id: string, patch: Partial<Todo>) {
    const now = new Date().toISOString();
    this.todos.set(this.todos().map(t => t.id === id ? { ...t, ...patch, updatedAt: now } : t));
  }

  remove(id: string) { this.todos.set(this.todos().filter(t => t.id !== id)); }

  get(id: string) { return this.todos().find(t => t.id === id) ?? null; }

  addProject(name: string) {
    this.projects.set([{ id: uuid(), name }, ...this.projects()]);
  }
}
