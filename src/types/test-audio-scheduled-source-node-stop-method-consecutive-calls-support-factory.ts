import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeContext } from './native-context';

export type TTestAudioScheduledSourceNodeStopMethodConsecutiveCallsSupportFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => (nativeContext: TNativeContext) => boolean;
