export class AudioNodeDisconnectMethodWrapper {

    wrap (audioNode) {
        var destinations = new Map();

        audioNode.connect = (function (connect) {
            return function (destination, output = 0, input = 0) {
                destinations.set(destination, {
                    input,
                    output
                });

                return connect.call(audioNode, destination, output, input);
            };
        }(audioNode.connect));

        audioNode.disconnect = (function (disconnect) {
            return function (destination) {
                disconnect.apply(audioNode);

                if (arguments.length > 0 && destinations.has(destination)) {
                    destinations.delete(destination);

                    destinations.forEach(function (value, destination) {
                        audioNode.connect(destination, value.input, value.output);
                    });
                }
            };
        }(audioNode.disconnect));

        return audioNode;
    }

}
