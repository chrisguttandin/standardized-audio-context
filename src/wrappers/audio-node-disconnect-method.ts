export class AudioNodeDisconnectMethodWrapper {

    public wrap (audioNode) {
        const destinations = new Map();

        audioNode.connect = ((connect) => {
            return (destination, output = 0, input = 0) => {
                destinations.set(destination, { input, output });

                return connect.call(audioNode, destination, output, input);
            };
        })(audioNode.connect);

        audioNode.disconnect = ((disconnect) => {
            return (destination = null) => {
                disconnect.apply(audioNode);

                if (destination !== null && destinations.has(destination)) {
                    destinations.delete(destination);

                    destinations.forEach(({ input, output }, dstntn) => {
                        audioNode.connect(dstntn, input, output);
                    });
                }
            };
        })(audioNode.disconnect);
    }

}
