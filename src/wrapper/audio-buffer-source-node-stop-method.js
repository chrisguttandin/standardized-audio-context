export class AudioBufferSourceNodeStopMethodWrapper {

    wrap (audioBufferSourceNode) { // eslint-disable-line class-methods-use-this
        var gainNode = audioBufferSourceNode.context.createGain();

        audioBufferSourceNode.connect(gainNode);
        audioBufferSourceNode.addEventListener('ended', () => audioBufferSourceNode.disconnect(gainNode));

        audioBufferSourceNode.connect = function (destination) {
            gainNode.connect.apply(gainNode, arguments);

            return destination;
        };

        audioBufferSourceNode.disconnect = function () {
            gainNode.disconnect.apply(gainNode, arguments);
        };

        audioBufferSourceNode.stop = (function (stop) {
            var isStopped = false;

            return function (when) {
                if (isStopped) {
                    try {
                        stop.apply(audioBufferSourceNode, arguments);
                    } catch (err) {
                        gainNode.gain.setValueAtTime(0, when);
                    }
                } else {
                    stop.apply(audioBufferSourceNode, arguments);

                    isStopped = true;
                }
            };
        }(audioBufferSourceNode.stop));

        return audioBufferSourceNode;
    }

}
