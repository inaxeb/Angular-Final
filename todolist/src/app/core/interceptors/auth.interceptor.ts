import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const user = auth.currentUser();
  const cloned = user ? req.clone({ setHeaders: { 'x-user-id': user.id } }) : req;
  return next(cloned);
};
