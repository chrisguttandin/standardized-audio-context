import { RENDERER_STORE } from '../globals';
import { IAudioParam, IAudioParamRenderer } from '../interfaces';
import { TNativeAudioParam } from '../types';

export const renderAutomation = (audioParam: IAudioParam, nativeAudioParam: TNativeAudioParam) => {
    const audioParamRenderer = <IAudioParamRenderer> RENDERER_STORE.get(audioParam);

    if (audioParamRenderer === undefined) {
        throw new Error('The associated renderer is missing.');
    }

    audioParamRenderer.render(nativeAudioParam);
};
