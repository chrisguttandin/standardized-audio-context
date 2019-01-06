import { OfflineAudioContext } from '../../src/module';

export const createOfflineAudioContext = ({ length = 5 } = { length: 5 }) => new OfflineAudioContext({ length, sampleRate: 44100 });
