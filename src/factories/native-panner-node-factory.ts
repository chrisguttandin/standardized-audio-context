import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativePannerNodeFactoryFactory } from '../types';

export const createNativePannerNodeFactory: TNativePannerNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioNode,
    createNativePannerNodeFaker
) => {
    return (nativeContext, options) => {
        // Bug #127: Edge, Opera & Safari do not throw an InvalidStateError yet.
        if (options.coneOuterGain < 0 || options.coneOuterGain > 1) {
            throw createInvalidStateError();
        }

        // Bug #130: Edge, Opera & Safari do not throw a RangeError yet.
        if (options.rolloffFactor < 0) {
            throw new RangeError();
        }

        const nativePannerNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createPanner());

        // Bug #124: Edge & Safari do not support modifying the orientation and the position with AudioParams.
        if (nativePannerNode.orientationX === undefined) {
            return createNativePannerNodeFaker(nativeContext, options);
        }

        assignNativeAudioNodeOptions(nativePannerNode, options);

        assignNativeAudioNodeAudioParamValue(nativePannerNode, options, 'orientationX');
        assignNativeAudioNodeAudioParamValue(nativePannerNode, options, 'orientationY');
        assignNativeAudioNodeAudioParamValue(nativePannerNode, options, 'orientationZ');
        assignNativeAudioNodeAudioParamValue(nativePannerNode, options, 'positionZ');
        assignNativeAudioNodeAudioParamValue(nativePannerNode, options, 'positionZ');
        assignNativeAudioNodeAudioParamValue(nativePannerNode, options, 'positionZ');

        assignNativeAudioNodeOption(nativePannerNode, options, 'coneInnerAngle');
        assignNativeAudioNodeOption(nativePannerNode, options, 'coneOuterAngle');
        assignNativeAudioNodeOption(nativePannerNode, options, 'coneOuterGain');
        assignNativeAudioNodeOption(nativePannerNode, options, 'distanceModel');
        assignNativeAudioNodeOption(nativePannerNode, options, 'maxDistance');
        assignNativeAudioNodeOption(nativePannerNode, options, 'panningModel');
        assignNativeAudioNodeOption(nativePannerNode, options, 'refDistance');
        assignNativeAudioNodeOption(nativePannerNode, options, 'rolloffFactor');

        return nativePannerNode;
    };
};
