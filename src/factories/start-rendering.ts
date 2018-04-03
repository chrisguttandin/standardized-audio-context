import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { TStartRenderingFactory } from '../types';

export const createStartRendering: TStartRenderingFactory = (renderNativeOfflineAudioContext) => {
    return (destination, unpatchedOfflineAudioContext) => {
        const audioDestinationNodeRenderer = AUDIO_NODE_RENDERER_STORE.get(destination);

        if (audioDestinationNodeRenderer === undefined) {
            throw new Error('Missing the associated renderer.');
        }

        return audioDestinationNodeRenderer
            .render(unpatchedOfflineAudioContext)
            .then(() => renderNativeOfflineAudioContext(unpatchedOfflineAudioContext));
    };
};
