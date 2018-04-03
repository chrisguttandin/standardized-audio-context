import { TNativeIIRFilterNodeFactoryFactory } from '../types';

export const createNativeIIRFilterNodeFactory: TNativeIIRFilterNodeFactoryFactory = (createNativeIIRFilterNodeFaker) => {
    return (nativeContext, options) => {
        // Bug #9: Safari does not support IIRFilterNodes.
        if (nativeContext.createIIRFilter === undefined) {
            return createNativeIIRFilterNodeFaker(nativeContext, options);
        }

        const iIRFilterNode = nativeContext.createIIRFilter(<number[]> options.feedforward, <number[]> options.feedback);

        if (options.channelCount !== undefined) {
            iIRFilterNode.channelCount = options.channelCount;
        }

        if (options.channelCountMode !== undefined) {
            iIRFilterNode.channelCountMode = options.channelCountMode;
        }

        if (options.channelInterpretation !== undefined) {
            iIRFilterNode.channelInterpretation = options.channelInterpretation;
        }

        return iIRFilterNode;
    };
};
