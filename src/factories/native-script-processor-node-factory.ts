import { TNativeScriptProcessorNodeFactoryFactory } from '../types';

export const createNativeScriptProcessorNodeFactory: TNativeScriptProcessorNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, bufferSize, numberOfInputChannels, numberOfOutputChannels) => {
        return createNativeAudioNode(nativeContext, (ntvCntxt) => {
            return ntvCntxt.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
        });
    };
};
