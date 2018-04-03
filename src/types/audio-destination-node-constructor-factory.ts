import { IAudioDestinationNodeConstructor, IAudioNodeConstructor } from '../interfaces';
import { TAudioDestinationNodeRendererFactory } from './audio-destination-node-renderer-factory';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioDestinationNodeFactory } from './native-audio-destination-node-factory';

export type TAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor: IAudioNodeConstructor,
    createAudioDestinationNodeRenderer: TAudioDestinationNodeRendererFactory,
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioDestinationNode: TNativeAudioDestinationNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => IAudioDestinationNodeConstructor;
