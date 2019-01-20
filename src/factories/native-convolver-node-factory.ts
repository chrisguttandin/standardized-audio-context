import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { cacheTestResult } from '../helpers/cache-test-result';
import { TNativeConvolverNodeFactoryFactory } from '../types';

export const createNativeConvolverNodeFactory: TNativeConvolverNodeFactoryFactory = (
    createNativeAudioNode,
    createNativeConvolverNodeFaker,
    createNotSupportedError,
    testConvolverNodeBufferReassignabilitySupport
) => {
    return (nativeContext, options) => {
        // Bug #116: Opera does not allow to reassign the buffer
        if (!cacheTestResult(
            testConvolverNodeBufferReassignabilitySupport,
            () => testConvolverNodeBufferReassignabilitySupport(nativeContext)
        )) {
            return createNativeConvolverNodeFaker(nativeContext, options);
        }

        const nativeConvolverNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createConvolver());

        assignNativeAudioNodeOptions(nativeConvolverNode, options);

        assignNativeAudioNodeOption(nativeConvolverNode, options, 'buffer');

        if (options.disableNormalization === nativeConvolverNode.normalize) {
            nativeConvolverNode.normalize = !options.disableNormalization;
        }

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
