import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

export const mockDelayInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> =>
  next(req).pipe(delay(400));
