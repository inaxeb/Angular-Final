import { Injectable, computed, effect, signal } from '@angular/core';
import { Role, User } from '../models';
import { v4 as uuid } from 'uuid';
import { storage } from '../storage';

const USERS_KEY = 'app_users';
const SESSION_KEY = 'app_session_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = signal<User[]>(storage.get<User[]>(USERS_KEY, [
    { id: uuid(), email: 'admin@demo.dev', passwordHash: 'admin', role: 'admin' },
    { id: uuid(), email: 'user@demo.dev',  passwordHash: 'user',  role: 'user'  },
  ]));

  private sessionUser = signal<User | null>(storage.get<User | null>(SESSION_KEY, null));

  private persistUsers = effect(() => storage.set(USERS_KEY, this.users()));
  private persistSession = effect(() => storage.set(SESSION_KEY, this.sessionUser()));

  readonly currentUser = computed(() => this.sessionUser());
  readonly isAdmin = computed(() => this.sessionUser()?.role === 'admin');

  register(email: string, password: string, role: Role = 'user') {
    const exists = this.users().some(u => u.email === email);
    if (exists) throw new Error('Email already exists');
    const user: User = { id: uuid(), email, passwordHash: password, role };
    this.users.set([...this.users(), user]);
    this.sessionUser.set(user);
  }

  login(email: string, password: string) {
    const user = this.users().find(u => u.email === email && u.passwordHash === password);
    if (!user) throw new Error('Invalid credentials');
    this.sessionUser.set(user);
  }

  logout() { this.sessionUser.set(null); }

  listUsers() { return this.users(); }
  setRole(userId: string, role: Role) {
    this.users.set(this.users().map(u => u.id === userId ? { ...u, role } : u));
  }
}
