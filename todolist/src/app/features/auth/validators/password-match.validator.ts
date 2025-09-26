import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pwd = control.get('password')?.value;
  const confirm = control.get('confirm')?.value;
  return pwd && confirm && pwd !== confirm ? { passwordMismatch: true } : null;
}
