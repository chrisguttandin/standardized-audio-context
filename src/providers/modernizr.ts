import { OpaqueToken } from '@angular/core';
import modernizr from '../browsernizr';

export const Modernizr = new OpaqueToken('MODERNIZR'); // tslint:disable-line:variable-name

export const MODERNIZR_PROVIDER = { provide: Modernizr, useValue: modernizr };
