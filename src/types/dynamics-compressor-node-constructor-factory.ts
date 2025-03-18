import type { createDynamicsCompressorNodeRendererFactory } from '../factories/dynamics-compressor-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TDynamicsCompressorNodeConstructor } from './dynamics-compressor-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeDynamicsCompressorNodeFactory } from './native-dynamics-compressor-node-factory';
import { TSetAudioNodeTailTimeFunction } from './set-audio-node-tail-time-function';

export type TDynamicsCompressorNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createDynamicsCompressorNodeRenderer: ReturnType<typeof createDynamicsCompressorNodeRendererFactory>,
    createNativeDynamicsCompressorNode: TNativeDynamicsCompressorNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    setAudioNodeTailTime: TSetAudioNodeTailTimeFunction
) => TDynamicsCompressorNodeConstructor;
