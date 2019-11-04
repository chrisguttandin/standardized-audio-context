import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeConvolverNodeFactoryFactory } from '../types';

export const createNativeConvolverNodeFactory: TNativeConvolverNodeFactoryFactory = (
    createNativeAudioNode,
    createNotSupportedError,
    overwriteAccessors
) => {
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

        overwriteAccessors(
            nativeConvolverNode,
            'channelCount',
            (get) => () => get.call(nativeConvolverNode),
            () => (value) => {
                if (value !== options.channelCount) {
                    throw createNotSupportedError();
                }
            }
        );

        // Bug #114: Edge & Safari allow to change the channelCountMode
        if (options.channelCountMode !== 'clamped-max') {
            throw createNotSupportedError();
        }

        overwriteAccessors(
            nativeConvolverNode,
            'channelCountMode',
            (get) => () => get.call(nativeConvolverNode),
            () => (value) => {
                if (value !== options.channelCountMode) {
                    throw createNotSupportedError();
                }
            }
        );

        return nativeConvolverNode;
    };
};
