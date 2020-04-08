import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeConvolverNodeFactoryFactory } from '../types';

export const createNativeConvolverNodeFactory: TNativeConvolverNodeFactoryFactory = (
    createNativeAudioNode,
    createNativeConvolverNodeFaker,
    createNotSupportedError,
    overwriteAccessors
) => {
    return (nativeContext, options) => {
        const nativeConvolverNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createConvolver());

        try {
            // Bug #166: Opera does not allow yet to set the channelCount to 1.
            nativeConvolverNode.channelCount = 1;
        } catch (err) {
            return createNativeConvolverNodeFaker(nativeContext, options);
        }

        assignNativeAudioNodeOptions(nativeConvolverNode, options);

        // The normalize property needs to be set before setting the buffer.
        if (options.disableNormalization === nativeConvolverNode.normalize) {
            nativeConvolverNode.normalize = !options.disableNormalization;
        }

        assignNativeAudioNodeOption(nativeConvolverNode, options, 'buffer');

        // Bug #113: Edge & Safari allow to set the channelCount to a value larger than 2.
        if (options.channelCount > 2) {
            throw createNotSupportedError();
        }

        overwriteAccessors(
            nativeConvolverNode,
            'channelCount',
            (get) => () => get.call(nativeConvolverNode),
            (set) => (value) => {
                if (value > 2) {
                    throw createNotSupportedError();
                }

                return set.call(nativeConvolverNode, value);
            }
        );

        // Bug #114: Edge & Safari allow to set the channelCountMode to 'max'.
        if (options.channelCountMode === 'max') {
            throw createNotSupportedError();
        }

        overwriteAccessors(
            nativeConvolverNode,
            'channelCountMode',
            (get) => () => get.call(nativeConvolverNode),
            (set) => (value) => {
                if (value === 'max') {
                    throw createNotSupportedError();
                }

                return set.call(nativeConvolverNode, value);
            }
        );

        return nativeConvolverNode;
    };
};
