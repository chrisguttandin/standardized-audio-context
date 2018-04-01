import { MinimalOfflineAudioContext } from '../../src/module';

export const createMinimalOfflineAudioContext = () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 });
