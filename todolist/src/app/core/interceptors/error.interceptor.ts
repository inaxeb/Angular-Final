import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.error('HTTP Error', err);
      inject(ErrorService).push(err.message || 'Unexpected HTTP error');
      return throwError(() => err);
    })
  );
