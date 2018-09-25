import { INativeAudioBufferConstructor } from '../interfaces';

export type TNativeAudioBufferConstructorFactory = (window: null | Window) => null | INativeAudioBufferConstructor;
