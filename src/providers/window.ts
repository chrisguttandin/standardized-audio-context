import { OpaqueToken } from '@angular/core';

export const Window = new OpaqueToken('WINDOW'); // tslint:disable-line:variable-name

export const WINDOW_PROVIDER = { provide: Window, useValue: window };
