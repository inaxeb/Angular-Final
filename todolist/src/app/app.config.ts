import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { mockDelayInterceptor } from './core/interceptors/mock-delay.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { mockApiInterceptor } from './core/interceptors/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
providers: [
provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        authInterceptor,
        mockApiInterceptor,
        errorInterceptor,
        mockDelayInterceptor,
      ])
    ),
  ],
};
