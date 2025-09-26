import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('registers and logs in a user', () => {
    service.register('a@b.c', 'pwd', 'user');
    expect(service.currentUser()).toBeTruthy();

    service.logout();
    expect(service.currentUser()).toBeNull();

    service.login('a@b.c', 'pwd');
    expect(service.currentUser()!.email).toBe('a@b.c');
  });

  it('rejects duplicate email', () => {
    service.register('a@b.c', 'pwd', 'user');
    expect(() => service.register('a@b.c', 'x', 'user')).toThrow();
  });
});
