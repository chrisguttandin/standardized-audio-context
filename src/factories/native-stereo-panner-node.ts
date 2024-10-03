import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeStereoPannerNodeFactory } from '../types';

export const createNativeStereoPannerNode: TNativeStereoPannerNodeFactory = (nativeContext, options) => {
    const nativeStereoPannerNode = nativeContext.createStereoPanner();

    assignNativeAudioNodeOptions(nativeStereoPannerNode, options);

    assignNativeAudioNodeAudioParamValue(nativeStereoPannerNode, options, 'pan');

    return nativeStereoPannerNode;
};
