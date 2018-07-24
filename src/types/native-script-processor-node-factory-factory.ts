import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeScriptProcessorNodeFactory } from './native-script-processor-node-factory';

export type TNativeScriptProcessorNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeScriptProcessorNodeFactory;
