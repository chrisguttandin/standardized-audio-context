import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeContext } from './native-context';

export type TTestAudioBufferSourceNodeStopMethodNullifiedBufferSupportFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => (nativeContext: TNativeContext) => boolean;
