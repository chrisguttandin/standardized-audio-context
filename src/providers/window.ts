import { OpaqueToken } from '@angular/core';

const windowToken = new OpaqueToken('WINDOW');

export { windowToken as window };

export const WINDOW_PROVIDER = { provide: windowToken, useValue: (typeof window === 'undefined') ? {} : window };
