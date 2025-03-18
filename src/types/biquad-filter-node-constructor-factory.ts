import type { createBiquadFilterNodeRendererFactory } from '../factories/biquad-filter-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TBiquadFilterNodeConstructor } from './biquad-filter-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeBiquadFilterNodeFactory } from './native-biquad-filter-node-factory';
import { TSetAudioNodeTailTimeFunction } from './set-audio-node-tail-time-function';

export type TBiquadFilterNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createBiquadFilterNodeRenderer: ReturnType<typeof createBiquadFilterNodeRendererFactory>,
    createNativeBiquadFilterNode: TNativeBiquadFilterNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    setAudioNodeTailTime: TSetAudioNodeTailTimeFunction
) => TBiquadFilterNodeConstructor;
