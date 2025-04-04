import type { createIIRFilterNodeRendererFactory } from '../factories/iir-filter-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIIRFilterNodeConstructor } from './iir-filter-node-constructor';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeIIRFilterNodeFactory } from './native-iir-filter-node-factory';
import { TSetAudioNodeTailTimeFunction } from './set-audio-node-tail-time-function';

export type TIIRFilterNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createNativeIIRFilterNode: TNativeIIRFilterNodeFactory,
    createIIRFilterNodeRenderer: ReturnType<typeof createIIRFilterNodeRendererFactory>,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    setAudioNodeTailTime: TSetAudioNodeTailTimeFunction
) => TIIRFilterNodeConstructor;
