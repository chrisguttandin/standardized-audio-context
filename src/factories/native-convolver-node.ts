import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeConvolverNodeFactory } from '../types';

export const createNativeConvolverNode: TNativeConvolverNodeFactory = (nativeContext, options) => {
    const nativeConvolverNode = nativeContext.createConvolver();

    assignNativeAudioNodeOptions(nativeConvolverNode, options);

    // The normalize property needs to be set before setting the buffer.
    if (options.disableNormalization === nativeConvolverNode.normalize) {
        nativeConvolverNode.normalize = !options.disableNormalization;
    }

    assignNativeAudioNodeOption(nativeConvolverNode, options, 'buffer');

    return nativeConvolverNode;
};
