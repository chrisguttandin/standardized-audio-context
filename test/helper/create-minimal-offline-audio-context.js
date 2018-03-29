import { MinimalOfflineAudioContext } from '../../src/audio-contexts/minimal-offline-audio-context';

export const createMinimalOfflineAudioContext = () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 });
