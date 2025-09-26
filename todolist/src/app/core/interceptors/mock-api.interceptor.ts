import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { storage } from '../storage';
import { Todo } from '../models';

const TODOS_KEY = 'app_todos';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
if (req.url.startsWith('/api/todos') && req.method === 'GET') {
    const todos = storage.get<Todo[]>(TODOS_KEY, []);
    return of(new HttpResponse({ status: 200, body: todos }));
  }
  return next(req);
};
