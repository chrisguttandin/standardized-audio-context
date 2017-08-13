import { InjectionToken } from '@angular/core';
import { CloseSupportTester } from '../testers/close-support';
import { DecodeAudioDataTypeErrorSupportTester } from '../testers/decode-audio-data-type-error-support';
import { MergingSupportTester } from '../testers/merging-support';
import { TModernizr, modernizr } from './modernizr';

export const isSupportedPromise = new InjectionToken<Promise<boolean>>('IS_SUPPORTED_PROMISE');

export const IS_SUPPORTED_PROMISE_PROVIDER = {
    deps: [ CloseSupportTester, DecodeAudioDataTypeErrorSupportTester, MergingSupportTester, modernizr ],
    provide: isSupportedPromise,
    useFactory: (
        closeSupportTester: CloseSupportTester,
        decodeAudioDataTypeErrorSupportTester: DecodeAudioDataTypeErrorSupportTester,
        mergingSupportTester: MergingSupportTester,
        mdrnzr: TModernizr
    ): Promise<boolean> => {
        if (mdrnzr.promises && mdrnzr.typedarrays && mdrnzr.webaudio && closeSupportTester.test()) {
            return Promise
                .all([
                    decodeAudioDataTypeErrorSupportTester.test(),
                    mergingSupportTester.test()
                ])
                .then(([ decodeAudioDataTypeErrorSupport, mergingSupport ]) => {
                    return decodeAudioDataTypeErrorSupport && mergingSupport;
                });
        }

        return Promise.resolve(false);
    }
};
