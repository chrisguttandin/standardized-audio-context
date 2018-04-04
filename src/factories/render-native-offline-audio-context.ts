import { cacheTestResult } from '../helpers/cache-test-result';
import { IOfflineAudioCompletionEvent } from '../interfaces';
import { testPromiseSupport } from '../support-testers/promise';
import { TNativeAudioBuffer, TNativeOfflineAudioContext, TRenderNativeOfflineAudioContextFactory } from '../types';

const isSupportingPromises = (context: TNativeOfflineAudioContext) => cacheTestResult(
    testPromiseSupport,
    () => testPromiseSupport(context)
);

export const createRenderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFactory = (createNativeGainNode) => {
    return (nativeOfflineAudioContext) => {
        // Bug #21: Safari does not support promises yet.
        if (isSupportingPromises(nativeOfflineAudioContext)) {
            return nativeOfflineAudioContext.startRendering();
        }

        return new Promise<TNativeAudioBuffer>((resolve) => {
            nativeOfflineAudioContext.oncomplete = (event: IOfflineAudioCompletionEvent) => {
                resolve(event.renderedBuffer);
            };

            // Bug #48: Safari does not render an OfflineAudioContext without any connected node.
            createNativeGainNode(nativeOfflineAudioContext, {
                channelCount: 1,
                channelCountMode: 'explicit',
                channelInterpretation: 'discrete',
                gain: 0
            })
                .connect(nativeOfflineAudioContext.destination);

            nativeOfflineAudioContext.startRendering();
        });
    };
};
