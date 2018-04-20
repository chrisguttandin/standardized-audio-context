import { AUDIO_PARAM_STORE } from '../globals';
import { IAudioParam } from '../interfaces';
import { TNativeAudioParam } from '../types';

export const getNativeAudioParam = (audioParam: IAudioParam): TNativeAudioParam => {
    const nativeAudioParam = AUDIO_PARAM_STORE.get(audioParam);

    if (nativeAudioParam === undefined) {
        throw new Error('The associated nativeAudioParam is missing.');
    }

    return nativeAudioParam;
};
