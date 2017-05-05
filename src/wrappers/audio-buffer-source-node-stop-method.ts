import { IAudioBufferSourceNode, IAudioContext, IAudioNode } from '../interfaces';

export class AudioBufferSourceNodeStopMethodWrapper {

    public wrap (audioBufferSourceNode: IAudioBufferSourceNode, audioContext: IAudioContext) {
        const gainNode = audioContext.createGain();

        audioBufferSourceNode.connect(gainNode);
        audioBufferSourceNode.addEventListener('ended', () => audioBufferSourceNode.disconnect(gainNode));

        audioBufferSourceNode.connect = (destination: IAudioNode, output = 0, input = 0) => {
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
