import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = new AuthService();
  });

  it('registers and logs in a user', () => {
    service.register('a@b.c','pwd','user');
    expect(service.currentUser()).toBeTruthy();
    service.logout();
    expect(service.currentUser()).toBeNull();
    service.login('a@b.c','pwd');
    expect(service.currentUser()!.email).toBe('a@b.c');
  });

  it('rejects duplicate email', () => {
    service.register('a@b.c','pwd','user');
    expect(() => service.register('a@b.c','x','user')).toThrow();
  });
});
