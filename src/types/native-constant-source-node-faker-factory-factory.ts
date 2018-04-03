import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TNativeConstantSourceNodeFakerFactory } from './native-constant-source-node-faker-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';

export type TNativeConstantSourceNodeFakerFactoryFactory = (
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory
) => TNativeConstantSourceNodeFakerFactory;
