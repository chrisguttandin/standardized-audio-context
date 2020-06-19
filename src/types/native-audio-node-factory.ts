import { TNativeAudioContext } from './native-audio-context';
import { TNativeAudioNode } from './native-audio-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeAudioNodeFactory = <T extends TNativeAudioNode, U extends TNativeAudioContext | TNativeOfflineAudioContext>(
    nativeContext: U,
    factoryFunction: (nativeContext: U) => T
) => T;
