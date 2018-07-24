import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TWrapConstantSourceNodeAccurateSchedulingFunction } from './wrap-constant-source-node-accurate-scheduling-function';

export type TWrapConstantSourceNodeAccurateSchedulingFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => TWrapConstantSourceNodeAccurateSchedulingFunction;
