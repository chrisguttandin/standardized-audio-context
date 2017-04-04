export class AudioBufferSourceNodeStopMethodWrapper {

    public wrap (audioBufferSourceNode, audioContext) {
        const gainNode = audioContext.createGain();

        audioBufferSourceNode.connect(gainNode);
        audioBufferSourceNode.addEventListener('ended', () => audioBufferSourceNode.disconnect(gainNode));

        audioBufferSourceNode.connect = (destination, output = 0, input = 0) => {
            gainNode.connect.call(gainNode, destination, output, input);

            return destination;
        };

        audioBufferSourceNode.disconnect = function () {
            gainNode.disconnect.apply(gainNode, arguments);
        };

        audioBufferSourceNode.stop = ((stop) => {
            let isStopped = false;

            return (when = 0) => {
                if (isStopped) {
                    try {
                        stop.call(audioBufferSourceNode, when);
                    } catch (err) {
                        gainNode.gain.setValueAtTime(0, when);
                    }
                } else {
                    stop.call(audioBufferSourceNode, when);

                    isStopped = true;
                }
            };
        })(audioBufferSourceNode.stop);
    }

}
