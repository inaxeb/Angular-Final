import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
standalone: true,
imports: [ReactiveFormsModule, RouterLink, NgIf],
template: `
<div class="container-app">
<div class="card max-w-md mx-auto mt-8">
<h2 class="page-title mb-4">Connexion</h2>
<form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
<input class="input" placeholder="Email" formControlName="email" />
<input class="input" placeholder="Mot de passe" type="password" formControlName="password" />

<p class="text-red-600 text-sm" *ngIf="error()">{{ error() }}</p>

        <div class="flex items-center gap-2">
          <button class="btn-primary" [disabled]="form.invalid">Se connecter</button>
          <a routerLink="/auth/register" class="nav-link underline">Créer un compte</a>
        </div>
      </form>
    </div>
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Échec de la connexion';
      this.error.set(msg);
    }
  }
}
