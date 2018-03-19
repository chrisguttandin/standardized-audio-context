import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { renderNativeOfflineAudioContext } from '../helpers/render-native-offline-audio-context';
import { IAudioDestinationNode } from '../interfaces';
import { TNativeAudioBuffer, TUnpatchedOfflineAudioContext } from '../types';

export const startRendering = (
    destination: IAudioDestinationNode, unpatchedOfflineAudioContext: TUnpatchedOfflineAudioContext
): Promise<TNativeAudioBuffer> => {
    const audioDestinationNodeRenderer = AUDIO_NODE_RENDERER_STORE.get(destination);

    if (audioDestinationNodeRenderer === undefined) {
        throw new Error('Missing the associated renderer.');
    }

    return audioDestinationNodeRenderer
        .render(unpatchedOfflineAudioContext)
        .then(() => renderNativeOfflineAudioContext(unpatchedOfflineAudioContext));
};
