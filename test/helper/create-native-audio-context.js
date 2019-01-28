import { createNativeAudioContextConstructor } from '../../src/factories/native-audio-context-constructor';
import { createWindow } from '../../src/factories/window';

const nativeAudioContextConstructor = createNativeAudioContextConstructor(createWindow());

export const createNativeAudioContext = () => new nativeAudioContextConstructor(); // eslint-disable-line new-cap
