import { INativeConstantSourceNode } from '../interfaces';
import { TNativeConstantSourceNodeFakerFactoryFactory } from '../types';

export const createNativeConstantSourceNodeFakerFactory: TNativeConstantSourceNodeFakerFactoryFactory = (
    createNativeAudioBufferSourceNode,
    createNativeGainNode
) => {
    return (nativeAudioContext, { offset, ...audioNodeOptions }) => {
        // @todo Safari does not play/loop 1 sample buffers. This should be covered by an expectation test.
        const audioBufferSourceNode = createNativeAudioBufferSourceNode(nativeAudioContext);
        /*
         * @todo Edge will throw a NotSupportedError when calling createBuffer() on a closed context. That's why the audioBuffer is created
         * after the audioBufferSourceNode in this case. If the context is closed createNativeAudioBufferSourceNode() will throw the
         * expected error and createBuffer() never gets called.
         */
        const audioBuffer = nativeAudioContext.createBuffer(1, 2, nativeAudioContext.sampleRate);
        const gainNode = createNativeGainNode(nativeAudioContext, { ...audioNodeOptions, gain: offset });

        // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
        const channelData = audioBuffer.getChannelData(0);

        channelData[0] = 1;
        channelData[1] = 1;

        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.loop = true;

        audioBufferSourceNode.connect(gainNode);

        return {
            get bufferSize () {
                return undefined;
            },
            get channelCount () {
                return gainNode.channelCount;
            },
            set channelCount (value) {
                gainNode.channelCount = value;
            },
            get channelCountMode () {
                return gainNode.channelCountMode;
            },
            set channelCountMode (value) {
                gainNode.channelCountMode = value;
            },
            get channelInterpretation () {
                return gainNode.channelInterpretation;
            },
            set channelInterpretation (value) {
                gainNode.channelInterpretation = value;
            },
            get context () {
                return gainNode.context;
            },
            get inputs () {
                return undefined;
            },
            get numberOfInputs () {
                return audioBufferSourceNode.numberOfInputs;
            },
            get numberOfOutputs () {
                return gainNode.numberOfOutputs;
            },
            get offset () {
                return gainNode.gain;
            },
            get onended () {
                return <INativeConstantSourceNode['onended']> audioBufferSourceNode.onended;
            },
            set onended (value) {
                audioBufferSourceNode.onended = <any> value;
            },
            addEventListener (...args: any[]) {
                return audioBufferSourceNode.addEventListener(args[0], args[1], args[2]);
            },
            connect (...args: any[]) {
                if (args[2] === undefined) {
                    return gainNode.connect.call(gainNode, args[0], args[1]);
                }

                return gainNode.connect.call(gainNode, args[0], args[1], args[2]);
            },
            disconnect (...args: any[]) {
                return gainNode.disconnect.call(gainNode, args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]) {
                return audioBufferSourceNode.dispatchEvent(args[0]);
            },
            removeEventListener (...args: any[]) {
                return audioBufferSourceNode.removeEventListener(args[0], args[1], args[2]);
            },
            start (when = 0) {
                audioBufferSourceNode.start.call(audioBufferSourceNode, when);
            },
            stop (when = 0) {
                audioBufferSourceNode.stop.call(audioBufferSourceNode, when);
            }
        };
    };
};
