import { TRenderNativeOfflineAudioContextFactory } from '../types';

export const createRenderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFactory = (
    cacheTestResult,
    createNativeScriptProcessorNode,
    testOfflineAudioContextCurrentTimeSupport
) => {
    return (nativeOfflineAudioContext) => {
        // Bug #158: Chrome does not advance currentTime if it is not accessed while rendering the audio.
        return Promise.resolve(cacheTestResult(testOfflineAudioContextCurrentTimeSupport, testOfflineAudioContextCurrentTimeSupport)).then(
            (isOfflineAudioContextCurrentTimeSupported) => {
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
            }
        );
    };
};
