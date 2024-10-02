import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeIIRFilterNodeFactory } from '../types';

export const createNativeIIRFilterNode: TNativeIIRFilterNodeFactory = (nativeContext, options) => {
    // @todo TypeScript defines the parameters of createIIRFilter() as arrays of numbers.
    const nativeIIRFilterNode = nativeContext.createIIRFilter(<number[]>options.feedforward, <number[]>options.feedback);

    assignNativeAudioNodeOptions(nativeIIRFilterNode, options);

    return nativeIIRFilterNode;
};
