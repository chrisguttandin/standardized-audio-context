import { DecodeAudioDataTypeErrorSupportTester } from './tester/decode-audio-data-type-error-support';
import { Inject } from '@angular/core';
import { MergingSupportTester } from './tester/merging-support';
import { modernizr } from './modernizr';

export function isSupportedPromise (decodeAudioDataTypeErrorSupportTester, mergingSupportTester, modernizr) {
    if (modernizr.promises && modernizr.typedarrays && modernizr.webaudio) {
        return Promise
            .all([
                // decodeAudioDataTypeErrorSupportTester.test(),
                mergingSupportTester.test()
            ])
            .then(function ([ /* decodeAudioDataTypeErrorSupport, */ mergingSupport ]) {
                return /* decodeAudioDataTypeErrorSupport && */ mergingSupport;
            });
    }

    return Promise.resolve(false);
}

isSupportedPromise.parameters = [ [ new Inject(DecodeAudioDataTypeErrorSupportTester) ], [ new Inject(MergingSupportTester) ], [ new Inject(modernizr) ] ];
