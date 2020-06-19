import { TAddSilentConnectionFactory } from '../types';

export const createAddSilentConnection: TAddSilentConnectionFactory = (createNativeGainNode) => {
    return (nativeContext, nativeAudioScheduledSourceNode) => {
        const nativeGainNode = createNativeGainNode(nativeContext, {
            channelCount: 1,
            channelCountMode: 'explicit',
            channelInterpretation: 'discrete',
            gain: 0
        });

        nativeAudioScheduledSourceNode
            .connect(nativeGainNode)
            /*
             * Bug #50: Edge does not yet allow to create AudioNodes on a closed AudioContext. Therefore the context property is
             * used here to make sure to connect the right destination.
             */
            .connect(nativeGainNode.context.destination);

        const disconnect = () => {
            nativeAudioScheduledSourceNode.removeEventListener('ended', disconnect);
            nativeAudioScheduledSourceNode.disconnect(nativeGainNode);
            nativeGainNode.disconnect();
        };

        nativeAudioScheduledSourceNode.addEventListener('ended', disconnect);
    };
};
