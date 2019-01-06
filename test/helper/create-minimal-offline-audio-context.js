import { MinimalOfflineAudioContext } from '../../src/module';

export const createMinimalOfflineAudioContext = ({ length = 5 } = { length: 5 }) => new MinimalOfflineAudioContext({ length, sampleRate: 44100 });
