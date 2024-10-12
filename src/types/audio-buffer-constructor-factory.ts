import { TAudioBufferConstructor } from './audio-buffer-constructor';
import { TAudioBufferStore } from './audio-buffer-store';
import { TNativeAudioBufferConstructor } from './native-audio-buffer-constructor';

export type TAudioBufferConstructorFactory = (
    audioBufferStore: TAudioBufferStore,
    nativeAudioBufferConstructor: null | TNativeAudioBufferConstructor
) => TAudioBufferConstructor;
