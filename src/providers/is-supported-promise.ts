import { InjectionToken } from '@angular/core';
import { AudioContextOptionsSupportTester } from '../testers/audio-context-options';
import { CloseSupportTester } from '../testers/close-support';
import { DecodeAudioDataTypeErrorSupportTester } from '../testers/decode-audio-data-type-error-support';
import { MergingSupportTester } from '../testers/merging-support';
import { TModernizr, modernizr } from './modernizr';

export const isSupportedPromise = new InjectionToken<Promise<boolean>>('IS_SUPPORTED_PROMISE');

export const IS_SUPPORTED_PROMISE_PROVIDER = {
    deps: [ AudioContextOptionsSupportTester, CloseSupportTester, DecodeAudioDataTypeErrorSupportTester, MergingSupportTester, modernizr ],
    provide: isSupportedPromise,
    useFactory: (
        audioContextOptionsSupportTester: AudioContextOptionsSupportTester,
        closeSupportTester: CloseSupportTester,
        decodeAudioDataTypeErrorSupportTester: DecodeAudioDataTypeErrorSupportTester,
        mergingSupportTester: MergingSupportTester,
        { promises, typedarrays, webaudio }: TModernizr
    ): Promise<boolean> => {
        if (promises && typedarrays && webaudio && audioContextOptionsSupportTester.test() && closeSupportTester.test()) {
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
