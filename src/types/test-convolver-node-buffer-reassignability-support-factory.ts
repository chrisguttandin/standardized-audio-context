import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeContext } from './native-context';

export type TTestConvolverNodeBufferReassignabilitySupportFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => (nativeContext: TNativeContext) => boolean;
