import { Inject } from '@angular/core';
import { MergingSupportTester } from './tester/merging-support';
import { modernizr } from './modernizr';

export function isSupportedPromise (mergingSupportTester, modernizr) {
    if (modernizr.promises && modernizr.typedarrays && modernizr.webaudio) {
        return mergingSupportTester.test();
    }

    return Promise.resolve(false);
}

isSupportedPromise.parameters = [ [ new Inject(MergingSupportTester) ], [ new Inject(modernizr) ] ];
