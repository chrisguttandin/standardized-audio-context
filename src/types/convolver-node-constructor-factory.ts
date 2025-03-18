import type { createConvolverNodeRendererFactory } from '../factories/convolver-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TConvolverNodeConstructor } from './convolver-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';
import { TSetAudioNodeTailTimeFunction } from './set-audio-node-tail-time-function';

export type TConvolverNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createConvolverNodeRenderer: ReturnType<typeof createConvolverNodeRendererFactory>,
    createNativeConvolverNode: TNativeConvolverNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    setAudioNodeTailTime: TSetAudioNodeTailTimeFunction
) => TConvolverNodeConstructor;
