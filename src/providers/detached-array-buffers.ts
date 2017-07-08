import { InjectionToken } from '@angular/core';

export const detachedArrayBuffers = new InjectionToken<WeakSet<ArrayBuffer>>('DETACHED_ARRAY_BUFFERS');

export const DETACHED_ARRAY_BUFFERS_PROVIDER = { provide: detachedArrayBuffers, useValue: new WeakSet() };
