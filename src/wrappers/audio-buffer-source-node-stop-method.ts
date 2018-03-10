import {
    TNativeAudioBufferSourceNode,
    TNativeAudioNode,
    TNativeAudioParam,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';

export class AudioBufferSourceNodeStopMethodWrapper {

    public wrap (
        audioBufferSourceNode: TNativeAudioBufferSourceNode, audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext
    ) {
        const gainNode = audioContext.createGain();

        audioBufferSourceNode.connect(gainNode);

        const disconnectGainNode = () => {
            audioBufferSourceNode.disconnect(gainNode);
            audioBufferSourceNode.removeEventListener('ended', disconnectGainNode);
        };

        audioBufferSourceNode.addEventListener('ended', disconnectGainNode);

        audioBufferSourceNode.connect = ((destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0) => {
            if (destination instanceof AudioNode) {
                gainNode.connect.call(gainNode, destination, output, input);

                // Bug #11: Safari does not support chaining yet.
                return destination;
            }

            // @todo This return statement is necessary to satisfy TypeScript.
            return gainNode.connect.call(gainNode, destination, output);
        });

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

export const AUDIO_BUFFER_SOURCE_NODE_STOP_METHOD_WRAPPER_PROVIDER = { deps: [ ], provide: AudioBufferSourceNodeStopMethodWrapper };
