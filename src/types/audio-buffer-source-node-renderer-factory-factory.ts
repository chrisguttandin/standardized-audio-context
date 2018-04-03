import { TAudioBufferSourceNodeRendererFactory } from './audio-buffer-source-node-renderer-factory';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';

export type TAudioBufferSourceNodeRendererFactoryFactory = (
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory
) => TAudioBufferSourceNodeRendererFactory;
