import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';

export type TNativeAudioBufferSourceNodeFactoryFactory = (
    testAudioBufferSourceNodeStartMethodDurationParameterSupport: () => Promise<boolean>
) => TNativeAudioBufferSourceNodeFactory;
