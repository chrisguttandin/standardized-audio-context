import { MinimalOfflineAudioContext } from '../../src/module';

export const createMinimalOfflineAudioContext = (options) => {
    const { length } = { length: 5, ...options };

    return new MinimalOfflineAudioContext({ length, sampleRate: 44100 });
};
