export class AudioNodeConnectMethodWrapper {

    public wrap (audioNode) {
        audioNode.connect = ((connect) => {
            return (destination, output = 0, input = 0) => {
                connect.call(audioNode, destination, output, input);

                return destination;
            };
        })(audioNode.connect);

        return audioNode;
    }

}
