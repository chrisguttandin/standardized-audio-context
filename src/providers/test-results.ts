import { InjectionToken } from '@angular/core';

export const testResultsToken = new InjectionToken<WeakMap<object, boolean>>('TEST_RESULTS');

export const testResults = new WeakMap();

export const TEST_RESULTS_PROVIDER = { provide: testResultsToken, useValue: testResults };
