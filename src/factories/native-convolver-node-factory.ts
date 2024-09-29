import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeConvolverNodeFactoryFactory } from '../types';

export const createNativeConvolverNodeFactory: TNativeConvolverNodeFactoryFactory = (createNotSupportedError, overwriteAccessors) => {
    return (nativeContext, options) => {
        const nativeConvolverNode = nativeContext.createConvolver();

        assignNativeAudioNodeOptions(nativeConvolverNode, options);

        // The normalize property needs to be set before setting the buffer.
        if (options.disableNormalization === nativeConvolverNode.normalize) {
            nativeConvolverNode.normalize = !options.disableNormalization;
        }

        assignNativeAudioNodeOption(nativeConvolverNode, options, 'buffer');

        // Bug #114: Safari allows to set the channelCountMode to 'max'.
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
