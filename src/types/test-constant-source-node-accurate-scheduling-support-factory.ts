import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TTestConstantSourceNodeAccurateSchedulingSupportFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => () => boolean;
