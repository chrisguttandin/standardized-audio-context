import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeWaveShaperNodeFactoryFactory } from '../types';

export const createNativeWaveShaperNodeFactory: TNativeWaveShaperNodeFactoryFactory = (
    createConnectedNativeAudioBufferSourceNode,
    createInvalidStateError,
    createNativeAudioNode,
    createNativeWaveShaperNodeFaker,
    isDCCurve,
    monitorConnections,
    overwriteAccessors
) => {
    return (nativeContext, options) => {
        const nativeWaveShaperNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createWaveShaper());

        try {
            // Bug #102: Safari does not throw an InvalidStateError when the curve has less than two samples.
            // Bug #119: Safari does not correctly map the values. Bug #102 is only used to detect Safari in this case.
            nativeWaveShaperNode.curve = new Float32Array([1]);

            return createNativeWaveShaperNodeFaker(nativeContext, options);
        } catch {
            // Ignore errors.
        }

        assignNativeAudioNodeOptions(nativeWaveShaperNode, options);

        const curve = options.curve === null || options.curve instanceof Float32Array ? options.curve : new Float32Array(options.curve);

        // Bug #104: Chrome, Edge and Opera will throw an InvalidAccessError when the curve has less than two samples.
        if (curve !== null && curve.length < 2) {
            throw createInvalidStateError();
        }

        // Bug #184: Safari requires the curve to be a Float32Array.
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
