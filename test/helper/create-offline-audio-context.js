import { OfflineAudioContext } from '../../src/module';

export const createOfflineAudioContext = (options) => {
    const { length } = { length: 5, ...options };

    new OfflineAudioContext({ length, sampleRate: 44100 });
};
