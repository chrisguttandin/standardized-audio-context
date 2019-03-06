import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeConvolverNodeFactoryFactory } from '../types';

export const createNativeConvolverNodeFactory: TNativeConvolverNodeFactoryFactory = (createNativeAudioNode, createNotSupportedError) => {
    return (nativeContext, options) => {
        const nativeConvolverNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createConvolver());

        assignNativeAudioNodeOptions(nativeConvolverNode, options);

        // The normalize property needs to be set before setting the buffer.
        if (options.disableNormalization === nativeConvolverNode.normalize) {
            nativeConvolverNode.normalize = !options.disableNormalization;
        }

        assignNativeAudioNodeOption(nativeConvolverNode, options, 'buffer');

        // Bug #113: Edge & Safari allow to change the channelCount
        if (options.channelCount !== 2) {
            throw createNotSupportedError();
        }

        Object.defineProperty(nativeConvolverNode, 'channelCount', {
            get: () => options.channelCount,
            set: (value) => {
                if (value !== options.channelCount) {
                    throw createNotSupportedError();
                }
            }
        });

        // Bug #114: Edge & Safari allow to change the channelCountMode
        if (options.channelCountMode !== 'clamped-max') {
            throw createNotSupportedError();
        }

        Object.defineProperty(nativeConvolverNode, 'channelCountMode', {
            get: () => options.channelCountMode,
            set: (value) => {
                if (value !== options.channelCountMode) {
                    throw createNotSupportedError();
                }
            }
        });

        return nativeConvolverNode;
    };
};
