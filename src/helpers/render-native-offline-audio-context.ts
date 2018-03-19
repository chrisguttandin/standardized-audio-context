import { Injector } from '@angular/core';
import { cacheTestResult } from '../helpers/cache-test-result';
import { IOfflineAudioCompletionEvent } from '../interfaces';
import { PROMISE_SUPPORT_TESTER_PROVIDER, PromiseSupportTester } from '../support-testers/promise';
import { TNativeAudioBuffer, TUnpatchedOfflineAudioContext } from '../types';

const injector = Injector.create({
    providers: [
        PROMISE_SUPPORT_TESTER_PROVIDER
    ]
});

const promiseSupportTester = injector.get(PromiseSupportTester);

const isSupportingPromises = (context: TUnpatchedOfflineAudioContext) => cacheTestResult(
    PromiseSupportTester,
    () => promiseSupportTester.test(context)
);

export const renderNativeOfflineAudioContext = (nativeOfflineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioBuffer> => {
    // Bug #21: Safari does not support promises yet.
    if (isSupportingPromises(nativeOfflineAudioContext)) {
        return nativeOfflineAudioContext.startRendering();
    }

    return new Promise<TNativeAudioBuffer>((resolve) => {
        nativeOfflineAudioContext.oncomplete = (event: IOfflineAudioCompletionEvent) => {
            resolve(event.renderedBuffer);
        };

        // Bug #48: Safari does not render an OfflineAudioContext without any connected node.
        nativeOfflineAudioContext
            .createGain()
            .connect(nativeOfflineAudioContext.destination);

        nativeOfflineAudioContext.startRendering();
    });
};
