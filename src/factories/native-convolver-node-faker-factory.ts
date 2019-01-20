import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { interceptConnections } from '../helpers/intercept-connections';
import { TNativeAudioNode, TNativeConvolverNode, TNativeConvolverNodeFakerFactoryFactory } from '../types';

export const createNativeConvolverNodeFakerFactory: TNativeConvolverNodeFakerFactoryFactory = (
    createNativeAudioNode,
    createNativeGainNode
) => {
    return (nativeContext, { buffer, disableNormalization, ...audioNodeOptions }) => {
        let convolverNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createConvolver());

        assignNativeAudioNodeOptions(convolverNode, audioNodeOptions);

        const inputGainNode = createNativeGainNode(nativeContext, { ...audioNodeOptions, gain: 1 });
        const outputGainNode = createNativeGainNode(nativeContext, { ...audioNodeOptions, gain: 1 });

        inputGainNode
            .connect(convolverNode)
            .connect(outputGainNode);

        const nativeConvolverNodeFaker = {
            get buffer (): TNativeConvolverNode['buffer'] {
                return convolverNode.buffer;
            },
            set buffer (value) {
                if (convolverNode.buffer !== null) {
                    inputGainNode.disconnect(convolverNode);
                    convolverNode.disconnect(outputGainNode);

                    const normalize = convolverNode.normalize;

                    convolverNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createConvolver());

                    assignNativeAudioNodeOptions(convolverNode, {
                        channelCount: inputGainNode.channelCount,
                        channelCountMode: inputGainNode.channelCountMode,
                        channelInterpretation: inputGainNode.channelInterpretation
                    });

                    convolverNode.normalize = normalize;

                    inputGainNode
                        .connect(convolverNode)
                        .connect(outputGainNode);
                }

                convolverNode.buffer = value;
            },
            get bufferSize (): undefined {
                return undefined;
            },
            get channelCount (): number {
                return convolverNode.channelCount;
            },
            set channelCount (value) {
                convolverNode.channelCount = value;
                inputGainNode.channelCount = value;
                outputGainNode.channelCount = value;
            },
            get channelCountMode (): TNativeConvolverNode['channelCountMode'] {
                return convolverNode.channelCountMode;
            },
            set channelCountMode (value) {
                convolverNode.channelCountMode = value;
                inputGainNode.channelCountMode = value;
                outputGainNode.channelCountMode = value;
            },
            get channelInterpretation (): TNativeConvolverNode['channelInterpretation'] {
                return convolverNode.channelInterpretation;
            },
            set channelInterpretation (value) {
                convolverNode.channelInterpretation = value;
                inputGainNode.channelInterpretation = value;
                outputGainNode.channelInterpretation = value;
            },
            get context (): TNativeConvolverNode['context'] {
                return convolverNode.context;
            },
            get inputs (): TNativeAudioNode[] {
                return [ inputGainNode ];
            },
            get numberOfInputs (): number {
                return convolverNode.numberOfInputs;
            },
            get numberOfOutputs (): number {
                return convolverNode.numberOfOutputs;
            },
            get normalize (): TNativeConvolverNode['normalize'] {
                return convolverNode.normalize;
            },
            set normalize (value) {
                convolverNode.normalize = value;
            },
            addEventListener (...args: any[]): void {
                return inputGainNode.addEventListener(args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]): boolean {
                return inputGainNode.dispatchEvent(args[0]);
            },
            removeEventListener (...args: any[]): void {
                return inputGainNode.removeEventListener(args[0], args[1], args[2]);
            }
        };

        if (buffer !== nativeConvolverNodeFaker.buffer) {
            nativeConvolverNodeFaker.buffer = buffer;
        }

        if (disableNormalization === nativeConvolverNodeFaker.normalize) {
            nativeConvolverNodeFaker.normalize = !disableNormalization;
        }

        return interceptConnections(nativeConvolverNodeFaker, outputGainNode);
    };
};
