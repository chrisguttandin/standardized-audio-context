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

        if (options.coneInnerAngle !== undefined) {
            nativePannerNode.coneInnerAngle = options.coneInnerAngle;
        }

        if (options.coneOuterAngle !== undefined) {
            nativePannerNode.coneOuterAngle = options.coneOuterAngle;
        }

        if (options.coneOuterGain !== undefined) {
            nativePannerNode.coneOuterGain = options.coneOuterGain;
        }

        if (options.distanceModel !== undefined) {
            nativePannerNode.distanceModel = options.distanceModel;
        }

        if (options.maxDistance !== undefined) {
            nativePannerNode.maxDistance = options.maxDistance;
        }

        if (options.orientationX !== nativePannerNode.orientationX.value) {
            nativePannerNode.orientationX.value = options.orientationX;
        }

        if (options.orientationY !== nativePannerNode.orientationY.value) {
            nativePannerNode.orientationY.value = options.orientationY;
        }

        if (options.orientationZ !== nativePannerNode.orientationZ.value) {
            nativePannerNode.orientationZ.value = options.orientationZ;
        }

        if (options.panningModel !== undefined) {
            nativePannerNode.panningModel = options.panningModel;
        }

        if (options.positionX !== nativePannerNode.positionX.value) {
            nativePannerNode.positionX.value = options.positionX;
        }

        if (options.positionY !== nativePannerNode.positionY.value) {
            nativePannerNode.positionY.value = options.positionY;
        }

        if (options.positionZ !== nativePannerNode.positionZ.value) {
            nativePannerNode.positionZ.value = options.positionZ;
        }

        if (options.refDistance !== undefined) {
            nativePannerNode.refDistance = options.refDistance;
        }

        if (options.rolloffFactor !== undefined) {
            nativePannerNode.rolloffFactor = options.rolloffFactor;
        }

        return nativePannerNode;
    };
};
