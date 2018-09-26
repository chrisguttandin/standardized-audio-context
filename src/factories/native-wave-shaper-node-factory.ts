import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeWaveShaperNodeFactoryFactory } from '../types';

export const createNativeWaveShaperNodeFactory: TNativeWaveShaperNodeFactoryFactory = (createInvalidStateError, createNativeAudioNode) => {
    return (nativeContext, options) => createNativeAudioNode(nativeContext, (ntvCntxt) => {
        const nativeWaveShaperNode = ntvCntxt.createWaveShaper();

        assignNativeAudioNodeOptions(nativeWaveShaperNode, options);

        if (options.curve !== nativeWaveShaperNode.curve) {
            const curve = options.curve;

            // Bug #102: Safari does not throw an InvalidStateError when the curve has less than two samples.
            // Bug #104: Chrome will throw an InvalidAccessError when the curve has less than two samples.
            if (curve !== null && curve.length < 2) {
                throw createInvalidStateError();
            }

            nativeWaveShaperNode.curve = curve;
        }

        if (options.oversample !== nativeWaveShaperNode.oversample) {
            nativeWaveShaperNode.oversample = options.oversample;
        }

        return nativeWaveShaperNode;
    });
};
