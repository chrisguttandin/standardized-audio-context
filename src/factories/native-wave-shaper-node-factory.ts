import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeWaveShaperNodeFactoryFactory } from '../types';

export const createNativeWaveShaperNodeFactory: TNativeWaveShaperNodeFactoryFactory = (
    createConnectedNativeAudioBufferSourceNode,
    createInvalidStateError,
    isDCCurve,
    monitorConnections,
    overwriteAccessors
) => {
    return (nativeContext, options) => {
        const nativeWaveShaperNode = nativeContext.createWaveShaper();

        assignNativeAudioNodeOptions(nativeWaveShaperNode, options);

        const curve = options.curve === null || options.curve instanceof Float32Array ? options.curve : new Float32Array(options.curve);

        // Bug #104: Chrome throws an InvalidAccessError when the curve has less than two samples.
        if (curve !== null && curve.length < 2) {
            throw createInvalidStateError();
        }

        // Only values of type Float32Array can be assigned to the curve property.
        assignNativeAudioNodeOption(nativeWaveShaperNode, { curve }, 'curve');
        assignNativeAudioNodeOption(nativeWaveShaperNode, options, 'oversample');

        let disconnectNativeAudioBufferSourceNode: null | (() => void) = null;
        let isConnected = false;

        overwriteAccessors(
            nativeWaveShaperNode,
            'curve',
            (get) => () => get.call(nativeWaveShaperNode),
            (set) => (value) => {
                set.call(nativeWaveShaperNode, value);

                if (isConnected) {
                    if (isDCCurve(value) && disconnectNativeAudioBufferSourceNode === null) {
                        disconnectNativeAudioBufferSourceNode = createConnectedNativeAudioBufferSourceNode(
                            nativeContext,
                            nativeWaveShaperNode
                        );
                    } else if (!isDCCurve(value) && disconnectNativeAudioBufferSourceNode !== null) {
                        disconnectNativeAudioBufferSourceNode();
                        disconnectNativeAudioBufferSourceNode = null;
                    }
                }

                return value;
            }
        );

        const whenConnected = () => {
            isConnected = true;

            if (isDCCurve(nativeWaveShaperNode.curve)) {
                disconnectNativeAudioBufferSourceNode = createConnectedNativeAudioBufferSourceNode(nativeContext, nativeWaveShaperNode);
            }
        };
        const whenDisconnected = () => {
            isConnected = false;

            if (disconnectNativeAudioBufferSourceNode !== null) {
                disconnectNativeAudioBufferSourceNode();
                disconnectNativeAudioBufferSourceNode = null;
            }
        };

        return monitorConnections(nativeWaveShaperNode, whenConnected, whenDisconnected);
    };
};
