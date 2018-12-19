import { TNativeAudioBufferConstructor } from './native-audio-buffer-constructor';

export type TNativeAudioBufferConstructorFactory = (window: null | Window) => null | TNativeAudioBufferConstructor;
