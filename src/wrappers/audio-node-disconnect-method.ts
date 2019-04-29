import { isNativeAudioNode } from '../guards/native-audio-node';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

export const wrapAudioNodeDisconnectMethod = (nativeAudioNode: TNativeAudioNode): void => {
    const destinations = new Map();

    nativeAudioNode.connect = ((connect) => {
        return (destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0) => {
            destinations.set(destination, { input, output });

            if (isNativeAudioNode(destination)) {
                // @todo TypeScript cannot infer the overloaded signature with 3 arguments yet.
                return (<any> connect).call(nativeAudioNode, destination, output, input);
            }

            return connect.call(nativeAudioNode, destination, output);
        };
    })(nativeAudioNode.connect);

    nativeAudioNode.disconnect = ((disconnect) => {
        return (outputOrDestination?: number | TNativeAudioNode | TNativeAudioParam, _output?: number, _input?: number) => {
            disconnect.apply(nativeAudioNode);

            if (outputOrDestination === undefined) {
                destinations.clear();
            } else if (destinations.has(outputOrDestination)) {
                destinations.delete(outputOrDestination);

                destinations.forEach(({ input, output }, dstntn) => {
                    nativeAudioNode.connect(dstntn, input, output);
                });
            }
        };
    })(nativeAudioNode.disconnect);
};
