import { INativeAudioContextConstructor } from '../interfaces';

export type TNativeAudioContextConstructorFactory = (window: null | Window) => null | INativeAudioContextConstructor;
