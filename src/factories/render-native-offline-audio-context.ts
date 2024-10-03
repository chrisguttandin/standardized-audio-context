import { testPromiseSupport } from '../helpers/test-promise-support';
import { IOfflineAudioCompletionEvent } from '../interfaces';
import { TNativeAudioBuffer, TRenderNativeOfflineAudioContextFactory } from '../types';

export const createRenderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFactory = (
    cacheTestResult,
    createNativeScriptProcessorNode,
    testOfflineAudioContextCurrentTimeSupport
) => {
    return (nativeOfflineAudioContext) => {
        // Bug #21: Safari does not support promises yet.
        if (cacheTestResult(testPromiseSupport, () => testPromiseSupport(nativeOfflineAudioContext))) {
            // Bug #158: Chrome does not advance currentTime if it is not accessed while rendering the audio.
            return Promise.resolve(
                cacheTestResult(testOfflineAudioContextCurrentTimeSupport, testOfflineAudioContextCurrentTimeSupport)
            ).then((isOfflineAudioContextCurrentTimeSupported) => {
                if (!isOfflineAudioContextCurrentTimeSupported) {
                    const scriptProcessorNode = createNativeScriptProcessorNode(nativeOfflineAudioContext, 512, 0, 1);

                    nativeOfflineAudioContext.oncomplete = () => {
                        scriptProcessorNode.onaudioprocess = null; // tslint:disable-line:deprecation
                        scriptProcessorNode.disconnect();
                    };
                    scriptProcessorNode.onaudioprocess = () => nativeOfflineAudioContext.currentTime; // tslint:disable-line:deprecation

                    scriptProcessorNode.connect(nativeOfflineAudioContext.destination);
                }

                return nativeOfflineAudioContext.startRendering();
            });
        }

        return new Promise<TNativeAudioBuffer>((resolve) => {
            nativeOfflineAudioContext.oncomplete = (event: IOfflineAudioCompletionEvent) => {
                resolve(event.renderedBuffer);
            };

            nativeOfflineAudioContext.startRendering();
        });
    };
};
