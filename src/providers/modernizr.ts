import { InjectionToken } from '@angular/core';
import mdrnzr from '../browsernizr';

export type TModernizr = typeof mdrnzr;

export const modernizr = new InjectionToken<TModernizr>('MODERNIZR');

export const MODERNIZR_PROVIDER = { provide: modernizr, useValue: mdrnzr };
