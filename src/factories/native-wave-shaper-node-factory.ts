import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeWaveShaperNodeFactoryFactory } from '../types';

export const createNativeWaveShaperNodeFactory: TNativeWaveShaperNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioNode,
    createNativeWaveShaperNodeFaker
) => {
    return (nativeContext, options) => {
        const nativeWaveShaperNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createWaveShaper());

        try {
            // Bug #102: Safari does not throw an InvalidStateError when the curve has less than two samples.
            // Bug #119: Safari does not correctly map the values. Bug #102 is only used to detect Safari in this case.
            nativeWaveShaperNode.curve = new Float32Array([ 1 ]);

            return createNativeWaveShaperNodeFaker(nativeContext, options);
        } catch { /* Ignore errors. */ }

        assignNativeAudioNodeOptions(nativeWaveShaperNode, options);

        const curve = options.curve;

        // Bug #104: Chrome will throw an InvalidAccessError when the curve has less than two samples.
        if (curve !== null && curve.length < 2) {
            throw createInvalidStateError();
        }

        assignNativeAudioNodeOption(nativeWaveShaperNode, options, 'curve');
        assignNativeAudioNodeOption(nativeWaveShaperNode, options, 'oversample');

        return nativeWaveShaperNode;
    };
};
