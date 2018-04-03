import { IAnalyserNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAnalyserNodeRendererFactory } from './analyser-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAnalyserNodeFactory } from './native-analyser-node-factory';

export type TAnalyserNodeConstructorFactory = (
    createAnalyserNodeRenderer: TAnalyserNodeRendererFactory,
    createNativeAnalyserNode: TNativeAnalyserNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IAnalyserNodeConstructor;
