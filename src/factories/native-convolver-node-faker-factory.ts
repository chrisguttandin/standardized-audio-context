import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { interceptConnections } from '../helpers/intercept-connections';
import { TNativeAudioNode, TNativeConvolverNode, TNativeConvolverNodeFakerFactoryFactory } from '../types';

export const createNativeConvolverNodeFakerFactory: TNativeConvolverNodeFakerFactoryFactory = (
    createNativeAudioNode,
    createNativeGainNode,
    monitorConnections
) => {
    return (nativeContext, { buffer, channelCount, channelCountMode, channelInterpretation, disableNormalization }) => {
        const convolverNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createConvolver());

        assignNativeAudioNodeOptions(convolverNode, {
            // Bug #166: Opera does not allow yet to set the channelCount to 1.
            channelCount: Math.max(channelCount, 2),
            // Bug #167: Opera does not allow yet to set the channelCountMode to 'explicit'.
            channelCountMode: channelCountMode === 'max' ? channelCountMode : 'clamped-max',
            channelInterpretation
        });

        const gainNode = createNativeGainNode(nativeContext, { channelCount, channelCountMode, channelInterpretation, gain: 1 });

        const nativeConvolverNodeFaker = {
            get buffer(): TNativeConvolverNode['buffer'] {
                return convolverNode.buffer;
            },
            set buffer(value) {
                convolverNode.buffer = value;
            },
            get bufferSize(): undefined {
                return undefined;
            },
            get channelCount(): number {
                return gainNode.channelCount;
            },
            set channelCount(value) {
                // Bug #166: Opera does not allow yet to set the channelCount to 1.
                if (value > 2) {
                    convolverNode.channelCount = value;
                }

                gainNode.channelCount = value;
            },
            get channelCountMode(): TNativeConvolverNode['channelCountMode'] {
                return gainNode.channelCountMode;
            },
            set channelCountMode(value) {
                // Bug #167: Opera does not allow yet to set the channelCountMode to 'explicit'.
                if (value === 'max') {
                    convolverNode.channelCountMode = value;
                }

                gainNode.channelCountMode = value;
            },
            get channelInterpretation(): TNativeConvolverNode['channelInterpretation'] {
                return convolverNode.channelInterpretation;
            },
            set channelInterpretation(value) {
                convolverNode.channelInterpretation = value;
                gainNode.channelInterpretation = value;
            },
            get context(): TNativeConvolverNode['context'] {
                return convolverNode.context;
            },
            get inputs(): TNativeAudioNode[] {
                return [convolverNode];
            },
            get numberOfInputs(): number {
                return convolverNode.numberOfInputs;
            },
            get numberOfOutputs(): number {
                return convolverNode.numberOfOutputs;
            },
            get normalize(): TNativeConvolverNode['normalize'] {
                return convolverNode.normalize;
            },
            set normalize(value) {
                convolverNode.normalize = value;
            },
            addEventListener(...args: any[]): void {
                return convolverNode.addEventListener(args[0], args[1], args[2]);
            },
            dispatchEvent(...args: any[]): boolean {
                return convolverNode.dispatchEvent(args[0]);
            },
            removeEventListener(...args: any[]): void {
                return convolverNode.removeEventListener(args[0], args[1], args[2]);
            }
        };

        // The normalize property needs to be set before setting the buffer.
        if (disableNormalization === nativeConvolverNodeFaker.normalize) {
            nativeConvolverNodeFaker.normalize = !disableNormalization;
        }

        if (buffer !== nativeConvolverNodeFaker.buffer) {
            nativeConvolverNodeFaker.buffer = buffer;
        }

        const whenConnected = () => convolverNode.connect(gainNode);
        const whenDisconnected = () => convolverNode.disconnect(gainNode);

        return monitorConnections(interceptConnections(nativeConvolverNodeFaker, gainNode), whenConnected, whenDisconnected);
    };
};
