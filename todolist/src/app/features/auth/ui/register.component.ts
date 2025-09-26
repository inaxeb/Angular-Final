import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';
import { Role } from '../../../core/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3" novalidate>
      <input class="w-full border p-2 rounded" placeholder="Email" formControlName="email" />
      <input class="w-full border p-2 rounded" placeholder="Password" type="password" formControlName="password" />
      <input class="w-full border p-2 rounded" placeholder="Confirm Password" type="password" formControlName="confirm" />
      <select class="w-full border p-2 rounded" formControlName="role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <div class="text-red-600" *ngIf="form.errors?.['passwordMismatch']">Passwords do not match</div>
      <div class="text-red-600" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Invalid email</div>

      <p class="text-red-600" *ngIf="error()">{{error()}}</p>

      <button class="px-4 py-2 bg-green-600 text-white rounded" [disabled]="form.invalid">Create account</button>
      <a routerLink="/auth/login" class="ml-2 underline">Back to login</a>
    </form>
  </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    confirm: ['', [Validators.required]],
    role: ['user', [Validators.required]],
  }, { validators: passwordMatchValidator });

  onSubmit() {
    if (this.form.invalid) return;
    this.error.set(null);
    const { email, password, role } = this.form.value;
    try {
      this.auth.register(email!, password!, role as Role);
      this.router.navigateByUrl('/todos');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Register failed';
      this.error.set(msg);
    }
  }
}
