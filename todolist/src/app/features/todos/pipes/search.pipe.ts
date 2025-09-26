import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../../../core/models';

@Pipe({ name: 'searchTodos', standalone: true, pure: true })
export class SearchTodosPipe implements PipeTransform {
  transform(todos: Todo[], term: string): Todo[] {
    if (!term) return todos;
    const q = term.toLowerCase();
    return todos.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description ?? '').toLowerCase().includes(q)
    );
  }
}
