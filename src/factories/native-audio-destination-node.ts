import { TNativeAudioDestinationNode, TNativeAudioDestinationNodeFactoryFactory, TNativeGainNode } from '../types';

export const createNativeAudioDestinationNodeFactory: TNativeAudioDestinationNodeFactoryFactory = (
    createNativeGainNode,
    overwriteAccessors
) => {
    return (nativeContext, channelCount) => {
        const nativeAudioDestinationNode = nativeContext.destination;

        // Bug #168: No browser does yet have an AudioDestinationNode with an output.
        const gainNode = createNativeGainNode(nativeContext, {
            channelCount,
            channelCountMode: nativeAudioDestinationNode.channelCountMode,
            channelInterpretation: nativeAudioDestinationNode.channelInterpretation,
            gain: 1
        });

        overwriteAccessors(
            gainNode,
            'channelCount',
            (get) => () => get.call(gainNode),
            (set) => (value) => {
                set.call(gainNode, value);
                nativeAudioDestinationNode.channelCount = value;
            }
        );

        overwriteAccessors(
            gainNode,
            'channelCountMode',
            (get) => () => get.call(gainNode),
            (set) => (value) => {
                set.call(gainNode, value);
                nativeAudioDestinationNode.channelCountMode = value;
            }
        );

        overwriteAccessors(
            gainNode,
            'channelInterpretation',
            (get) => () => get.call(gainNode),
            (set) => (value) => {
                set.call(gainNode, value);
                nativeAudioDestinationNode.channelInterpretation = value;
            }
        );

        Object.defineProperty(gainNode, 'maxChannelCount', {
            get: () => nativeAudioDestinationNode.maxChannelCount
        });

        // @todo This should be disconnected when the context is closed.
        gainNode.connect(nativeAudioDestinationNode);

        return <{ maxChannelCount: TNativeAudioDestinationNode['maxChannelCount'] } & TNativeGainNode>gainNode;
    };
};
