import { IAudioDestinationNodeConstructor, IAudioNodeConstructor } from '../interfaces';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioDestinationNodeFactory } from './native-audio-destination-node-factory';

export type TAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor: IAudioNodeConstructor,
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioDestinationNode: TNativeAudioDestinationNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction
) => IAudioDestinationNodeConstructor;
