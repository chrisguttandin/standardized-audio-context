import { interceptConnections } from '../helpers/intercept-connections';
import { TNativeAudioBufferSourceNode, TNativeAudioNode, TNativeConstantSourceNode, TNativeConstantSourceNodeFakerFactoryFactory } from '../types';

export const createNativeConstantSourceNodeFakerFactory: TNativeConstantSourceNodeFakerFactoryFactory = (
    createNativeAudioBufferSourceNode,
    createNativeGainNode
) => {
    return (nativeContext, { offset, ...audioNodeOptions }) => {
        const audioBuffer = nativeContext.createBuffer(1, 2, nativeContext.sampleRate);
        const audioBufferSourceNode = createNativeAudioBufferSourceNode(nativeContext);
        const gainNode = createNativeGainNode(nativeContext, { ...audioNodeOptions, gain: offset });

        // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
        const channelData = audioBuffer.getChannelData(0);

        // Bug #95: Safari does not play or loop one sample buffers.
        channelData[0] = 1;
        channelData[1] = 1;

        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.loop = true;

        audioBufferSourceNode.connect(gainNode);

        const nativeConstantSourceNodeFaker = {
            get bufferSize (): undefined {
                return undefined;
            },
            get channelCount (): number {
                return gainNode.channelCount;
            },
            set channelCount (value) {
                gainNode.channelCount = value;
            },
            get channelCountMode (): TNativeConstantSourceNode['channelCountMode'] {
                return gainNode.channelCountMode;
            },
            set channelCountMode (value) {
                gainNode.channelCountMode = value;
            },
            get channelInterpretation (): TNativeConstantSourceNode['channelInterpretation'] {
                return gainNode.channelInterpretation;
            },
            set channelInterpretation (value) {
                gainNode.channelInterpretation = value;
            },
            get context (): TNativeConstantSourceNode['context'] {
                return gainNode.context;
            },
            get inputs (): TNativeAudioNode[] {
                return [ ];
            },
            get numberOfInputs (): number {
                return audioBufferSourceNode.numberOfInputs;
            },
            get numberOfOutputs (): number {
                return gainNode.numberOfOutputs;
            },
            get offset (): TNativeConstantSourceNode['offset'] {
                return gainNode.gain;
            },
            get onended (): TNativeConstantSourceNode['onended'] {
                return audioBufferSourceNode.onended;
            },
            set onended (value) {
                audioBufferSourceNode.onended = <TNativeAudioBufferSourceNode['onended']> value;
            },
            addEventListener (...args: any[]): void {
                return audioBufferSourceNode.addEventListener(args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]): boolean {
                return audioBufferSourceNode.dispatchEvent(args[0]);
            },
            removeEventListener (...args: any[]): void {
                return audioBufferSourceNode.removeEventListener(args[0], args[1], args[2]);
            },
            start (when = 0): void {
                audioBufferSourceNode.start.call(audioBufferSourceNode, when);
            },
            stop (when = 0): void {
                audioBufferSourceNode.stop.call(audioBufferSourceNode, when);
            }
        };

        return interceptConnections(nativeConstantSourceNodeFaker, gainNode);
    };
};
