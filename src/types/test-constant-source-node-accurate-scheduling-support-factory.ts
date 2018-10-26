import { INativeOfflineAudioContextConstructor } from '../interfaces';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';

export type TTestConstantSourceNodeAccurateSchedulingSupportFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor
) => () => boolean;
