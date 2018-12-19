import { TNativeAudioContextConstructor } from './native-audio-context-constructor';

export type TNativeAudioContextConstructorFactory = (window: null | Window) => null | TNativeAudioContextConstructor;
