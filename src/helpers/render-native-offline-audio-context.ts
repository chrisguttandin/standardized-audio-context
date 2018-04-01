import { cacheTestResult } from '../helpers/cache-test-result';
import { createNativeGainNode } from '../helpers/create-native-gain-node';
import { IOfflineAudioCompletionEvent } from '../interfaces';
import { testPromiseSupport } from '../support-testers/promise';
import { TNativeAudioBuffer, TUnpatchedOfflineAudioContext } from '../types';

const isSupportingPromises = (context: TUnpatchedOfflineAudioContext) => cacheTestResult(
    testPromiseSupport,
    () => testPromiseSupport(context)
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
        createNativeGainNode(nativeOfflineAudioContext)
            .connect(nativeOfflineAudioContext.destination);

        nativeOfflineAudioContext.startRendering();
    });
};
