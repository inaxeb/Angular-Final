import { TestBed } from '@angular/core/testing';
import { TodoPageComponent } from './todo-page.component';
import { AuthService } from '../../../core/services/auth.service';

describe('TodoPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TodoPageComponent],
      providers: [AuthService]
    }).compileComponents();
  });

  it('renders and can create a todo', () => {
    const fixture = TestBed.createComponent(TodoPageComponent);
    const comp = fixture.componentInstance;
    const auth = TestBed.inject(AuthService);
    auth.register('x@y.z','pwd','user');
    comp.title = 'Test todo';
    comp.create();
    fixture.detectChanges();
    expect(comp.count()).toBe(1);
  });
});
