import { OfflineAudioContext } from '../../src/audio-contexts/offline-audio-context';

export const createOfflineAudioContext = () => new OfflineAudioContext({ length: 5, sampleRate: 44100 });
