import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
private http = inject(HttpClient);
fetchTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>('/api/todos');
  }
}
