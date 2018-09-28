import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeStereoPannerNodeFactoryFactory } from '../types';

export const createNativeStereoPannerNodeFactory: TNativeStereoPannerNodeFactoryFactory = (
    createNativeAudioNode,
    createNativeStereoPannerNodeFaker,
    createNotSupportedError
) => {
    return (nativeContext, options) => createNativeAudioNode(nativeContext, (ntvCntxt) => {
        const channelCountMode = options.channelCountMode;
        /*
         * Bug #105: The channelCountMode of 'clamped-max' should be supported. However it is not possible to write a polyfill for Safari
         * which supports it and therefore it can't be supported at all.
         */
        if (options.channelCountMode === 'clamped-max') {
            throw createNotSupportedError();
        }

        // Bug #105: Safari does not support the StereoPannerNode.
        if (nativeContext.createStereoPanner === undefined) {
            return createNativeStereoPannerNodeFaker(nativeContext, options);
        }

        const nativeStereoPannerNode = ntvCntxt.createStereoPanner();

        assignNativeAudioNodeOptions(nativeStereoPannerNode, options);

        if (options.pan !== nativeStereoPannerNode.pan.value) {
            nativeStereoPannerNode.pan.value = options.pan;
        }

        // Bug #107: Firefox does not kick off the processing of the StereoPannerNode if the value of pan is zero.
        if (options.pan === 0) {
            const gainNode = ntvCntxt.createGain();

            gainNode.connect(nativeStereoPannerNode.pan);
        }

        /*
         * Bug #105: The channelCountMode of 'clamped-max' should be supported. However it is not possible to write a polyfill for Safari
         * which supports it and therefore it can't be supported at all.
         */
        Object.defineProperty(nativeStereoPannerNode, 'channelCountMode', {
            get: () => channelCountMode,
            set: (value) => {
                if (value !== channelCountMode) {
                    throw createNotSupportedError();
                }
            }
        });

        return nativeStereoPannerNode;
    });
};
