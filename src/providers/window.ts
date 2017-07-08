import { InjectionToken } from '@angular/core';

export const windowToken = new InjectionToken<Window>('WINDOW');

export { windowToken as window };

export const WINDOW_PROVIDER = { provide: windowToken, useValue: (typeof window === 'undefined') ? {} : window };
