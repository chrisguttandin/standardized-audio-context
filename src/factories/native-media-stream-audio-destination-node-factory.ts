import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeMediaStreamAudioDestinationNodeFactoryFactory } from '../types';

export const createNativeMediaStreamAudioDestinationNodeFactory: TNativeMediaStreamAudioDestinationNodeFactoryFactory = (
    createNativeAudioNode
) => {
    return (nativeAudioContext, options) => {
        const nativeMediaStreamAudioDestinationNode = createNativeAudioNode(nativeAudioContext, (ntvDCntxt) => {
            return ntvDCntxt.createMediaStreamDestination();
        });

        assignNativeAudioNodeOptions(nativeMediaStreamAudioDestinationNode, options);

        // Bug #174: Safari does expose a wrong numberOfOutputs.
        if (nativeMediaStreamAudioDestinationNode.numberOfOutputs === 1) {
            Object.defineProperty(nativeMediaStreamAudioDestinationNode, 'numberOfOutputs', { get: () => 0 });
        }

        return nativeMediaStreamAudioDestinationNode;
    };
};
