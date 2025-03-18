import type { createAudioDestinationNodeRenderer as createAudioDestinationNodeRendererFunction } from '../factories/audio-destination-node-renderer-factory';
import { TAudioDestinationNodeConstructor } from './audio-destination-node-constructor';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioDestinationNodeFactory } from './native-audio-destination-node-factory';
import { TRenderInputsOfAudioNodeFunction } from './render-inputs-of-audio-node-function';

export type TAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioDestinationNodeRenderer: typeof createAudioDestinationNodeRendererFunction,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioDestinationNode: TNativeAudioDestinationNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => TAudioDestinationNodeConstructor;
