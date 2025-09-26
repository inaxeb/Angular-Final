import { Pipe, PipeTransform } from '@angular/core';
import { TodoStatus } from '../../../core/models';

/** Maps internal status to English UI labels (original behavior). */
@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
transform(status: TodoStatus): string {
    switch (status) {
      case 'todo':  return 'To do';
      case 'doing': return 'In progress';
      case 'done':  return 'Done';
      default:      return String(status);
    }
  }
}
