export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export type TodoStatus = 'todo' | 'doing' | 'done';

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  status: TodoStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}
