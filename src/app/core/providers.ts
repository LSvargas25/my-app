import { Provider } from '@angular/core';
import { authInterceptor } from './interceptors/auth.interceptor';

export const CORE_PROVIDERS: Provider[] = [
  // Add core providers here
  // Example: { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true }
];
