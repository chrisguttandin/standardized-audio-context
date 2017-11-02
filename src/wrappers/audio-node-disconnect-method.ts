import { IAudioNode } from '../interfaces';
import { TNativeAudioNode } from '../types';

export class AudioNodeDisconnectMethodWrapper {

    public wrap (audioNode: TNativeAudioNode) {
        const destinations = new Map();

        (<IAudioNode['connect']> (<any> audioNode.connect)) = ((connect) => {
            return (destination: IAudioNode, output = 0, input = 0) => {
                destinations.set(destination, { input, output });

                return connect.call(audioNode, destination, output, input);
            };
        })(audioNode.connect);

        (<IAudioNode['disconnect']> audioNode.disconnect) = ((disconnect) => {
            return (destination?: IAudioNode) => {
                disconnect.apply(audioNode);

                if (destination !== undefined && destinations.has(destination)) {
                    destinations.delete(destination);

                    destinations.forEach(({ input, output }, dstntn) => {
                        audioNode.connect(dstntn, input, output);
                    });
                }
            };
        })(audioNode.disconnect);
    }

}

export const AUDIO_NODE_DISCONNECT_METHOD_WRAPPER_PROVIDER = { deps: [ ], provide: AudioNodeDisconnectMethodWrapper };
