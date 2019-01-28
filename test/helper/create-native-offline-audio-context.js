import { createNativeOfflineAudioContextConstructor } from '../../src/factories/native-offline-audio-context-constructor';
import { createWindow } from '../../src/factories/window';

const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(createWindow());

export const createNativeOfflineAudioContext = () => new nativeOfflineAudioContextConstructor(1, 1, 44100); // eslint-disable-line new-cap
