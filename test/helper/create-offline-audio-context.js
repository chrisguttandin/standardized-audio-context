import { OfflineAudioContext } from '../../src/module';

export const createOfflineAudioContext = () => new OfflineAudioContext({ length: 5, sampleRate: 44100 });
