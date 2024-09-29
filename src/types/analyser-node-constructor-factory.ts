import { TAnalyserNodeConstructor } from './analyser-node-constructor';
import { TAnalyserNodeRendererFactory } from './analyser-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAnalyserNodeFactory } from './native-analyser-node-factory';

export type TAnalyserNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAnalyserNodeRenderer: TAnalyserNodeRendererFactory,
    createNativeAnalyserNode: TNativeAnalyserNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TAnalyserNodeConstructor;
