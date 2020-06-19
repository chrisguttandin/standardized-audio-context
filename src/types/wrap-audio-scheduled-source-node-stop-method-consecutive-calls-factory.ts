import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TWrapAudioScheduledSourceNodeStopMethodConsecutiveCallsFunction } from './wrap-audio-scheduled-source-node-stop-method-consecutive-calls-function';

export type TWrapAudioScheduledSourceNodeStopMethodConsecutiveCallsFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => TWrapAudioScheduledSourceNodeStopMethodConsecutiveCallsFunction;
