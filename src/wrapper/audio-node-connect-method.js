export class AudioNodeConnectMethodWrapper {

    wrap (audioNode) { // eslint-disable-line class-methods-use-this
        audioNode.connect = (function (connect) {
            return function (destination) {
                connect.apply(audioNode, arguments);

                return destination;
            };
        }(audioNode.connect));

        return audioNode;
    }

}
