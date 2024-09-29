import { TCreateNativeOfflineAudioContextFactory } from '../types';

export const createCreateNativeOfflineAudioContext: TCreateNativeOfflineAudioContextFactory = (nativeOfflineAudioContextConstructor) => {
    return (numberOfChannels, length, sampleRate) => {
        if (nativeOfflineAudioContextConstructor === null) {
            throw new Error('Missing the native OfflineAudioContext constructor.');
        }

        return new nativeOfflineAudioContextConstructor(numberOfChannels, length, sampleRate);
    };
};
