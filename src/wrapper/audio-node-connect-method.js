export class AudioNodeConnectMethodWrapper {

    wrap (audioNode) {
        audioNode.connect = (function (connect) {
            return function (destination) {
                connect.apply(audioNode, arguments);

                return destination;
            };
        }(audioNode.connect));

        return audioNode;
    }

}
