import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
      <input class="w-full border p-2 rounded" placeholder="Email" formControlName="email" />
      <input class="w-full border p-2 rounded" placeholder="Password" type="password" formControlName="password" />

      <p class="text-red-600" *ngIf="error()">{{error()}}</p>

      <button class="px-4 py-2 bg-blue-600 text-white rounded" [disabled]="form.invalid">Login</button>
      <a routerLink="/auth/register" class="ml-2 underline">Register</a>
    </form>
  </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    this.error.set(null);
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    try {
      this.auth.login(email!, password!);
      this.router.navigateByUrl('/todos');
    } catch (e: any) {
      this.error.set(e.message ?? 'Login failed');
    }
  }
}
