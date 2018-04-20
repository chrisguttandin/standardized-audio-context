import { INativeConstantSourceNode } from '../interfaces';
import {
    TNativeAudioBufferSourceNode,
    TNativeAudioNode,
    TNativeAudioParam,
    TNativeContext,
    TNativeOscillatorNode
} from '../types';

export const wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls = (
    nativeAudioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode,
    nativeContext: TNativeContext
): void => {
    const gainNode = nativeContext.createGain();

    nativeAudioScheduledSourceNode.connect(gainNode);

    const disconnectGainNode = ((disconnect) => {
        return () => {
            disconnect.call(nativeAudioScheduledSourceNode, gainNode);
            (<any> nativeAudioScheduledSourceNode).removeEventListener('ended', disconnectGainNode);
        };
    })(nativeAudioScheduledSourceNode.disconnect);

    (<any> nativeAudioScheduledSourceNode).addEventListener('ended', disconnectGainNode);

    nativeAudioScheduledSourceNode.connect = ((destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0) => {
        if (destination instanceof AudioNode) {
            gainNode.connect.call(gainNode, destination, output, input);

            // Bug #11: Safari does not support chaining yet.
            return destination;
        }

        // @todo This return statement is necessary to satisfy TypeScript.
        return gainNode.connect.call(gainNode, destination, output);
    });

    nativeAudioScheduledSourceNode.disconnect = function () {
        gainNode.disconnect.apply(gainNode, arguments);
    };

    nativeAudioScheduledSourceNode.stop = ((stop) => {
        let isStopped = false;

        return (when = 0) => {
            if (isStopped) {
                try {
                    stop.call(nativeAudioScheduledSourceNode, when);
                } catch (err) {
                    gainNode.gain.setValueAtTime(0, when);
                }
            } else {
                stop.call(nativeAudioScheduledSourceNode, when);

                isStopped = true;
            }
        };
    })(nativeAudioScheduledSourceNode.stop);
};
