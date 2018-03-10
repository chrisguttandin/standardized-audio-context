import { TNativeAudioNode, TNativeAudioParam } from '../types';

export class AudioNodeDisconnectMethodWrapper {

    public wrap (audioNode: TNativeAudioNode) {
        const destinations = new Map();

        audioNode.connect = ((connect) => {
            return (destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0) => {
                destinations.set(destination, { input, output });

                if (destination instanceof AudioNode) {
                    return connect.call(audioNode, destination, output, input);
                }

                return connect.call(audioNode, destination, output);
            };
        })(audioNode.connect);

        audioNode.disconnect = ((disconnect) => {
            return (outputOrDestination?: number | TNativeAudioNode | TNativeAudioParam, _output?: number, _input?: number) => {
                disconnect.apply(audioNode);

                if (outputOrDestination !== undefined && destinations.has(outputOrDestination)) {
                    destinations.delete(outputOrDestination);

                    destinations.forEach(({ input, output }, dstntn) => {
                        audioNode.connect(dstntn, input, output);
                    });
                }
            };
        })(audioNode.disconnect);
    }

}

export const AUDIO_NODE_DISCONNECT_METHOD_WRAPPER_PROVIDER = { deps: [ ], provide: AudioNodeDisconnectMethodWrapper };
