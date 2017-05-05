import { IAudioNode } from '../interfaces';

export class AudioNodeDisconnectMethodWrapper {

    public wrap (audioNode: IAudioNode) {
        const destinations = new Map();

        audioNode.connect = ((connect) => {
            return (destination: IAudioNode, output = 0, input = 0) => {
                destinations.set(destination, { input, output });

                return connect.call(audioNode, destination, output, input);
            };
        })(audioNode.connect);

        audioNode.disconnect = ((disconnect) => {
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
