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
<div class="container-app">
<div class="card max-w-md mx-auto mt-8">
<h2 class="page-title mb-4">Créer un compte</h2>

<form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3" novalidate>
<input class="input" placeholder="Email" formControlName="email" />
<input class="input" placeholder="Mot de passe" type="password" formControlName="password" />
<input class="input" placeholder="Confirmer le mot de passe" type="password" formControlName="confirm" />
<select class="select" formControlName="role">
<option value="user">Utilisateur</option>
<option value="admin">Administrateur</option>
</select>

<div class="text-red-600 text-sm" *ngIf="form.errors?.['passwordMismatch']">Les mots de passe ne correspondent pas</div>
<div class="text-red-600 text-sm" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Email invalide</div>

<p class="text-red-600 text-sm" *ngIf="error()">{{ error() }}</p>

        <div class="flex items-center gap-2">
          <button class="btn-primary" [disabled]="form.invalid">Créer le compte</button>
          <a routerLink="/auth/login" class="nav-link underline">Retour à la connexion</a>
        </div>
      </form>
    </div>
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
      const msg = e instanceof Error ? e.message : "Échec de l'inscription";
      this.error.set(msg);
    }
  }
}
