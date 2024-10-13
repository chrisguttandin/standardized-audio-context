import { TStartRenderingFactory } from '../types';

export const createStartRendering: TStartRenderingFactory = (audioBufferStore, getAudioNodeRenderer, getUnrenderedAudioWorkletNodes) => {
    return (destination, nativeOfflineAudioContext) =>
        getAudioNodeRenderer(destination)
            .render(destination, nativeOfflineAudioContext)
            /*
             * Bug #87: Invoking the renderer of an AudioWorkletNode might be necessary if it has no direct or indirect connection to the
             * destination.
             */
            .then(() =>
                Promise.all(
                    Array.from(getUnrenderedAudioWorkletNodes(nativeOfflineAudioContext)).map((audioWorkletNode) =>
                        getAudioNodeRenderer(audioWorkletNode).render(audioWorkletNode, nativeOfflineAudioContext)
                    )
                )
            )
            .then(() => nativeOfflineAudioContext.startRendering())
            .then((audioBuffer) => {
                audioBufferStore.add(audioBuffer);

                return audioBuffer;
            });
};
