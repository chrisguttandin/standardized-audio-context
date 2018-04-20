import { INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeOscillatorNode } from '../types';

export const wrapAudioScheduledSourceNodeStopMethodNegativeParameters = (
    nativeAudioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode
): void => {
    nativeAudioScheduledSourceNode.stop = ((stop) => {
        return (when = 0) => {
            if (when < 0) {
                throw new RangeError("The parameter can't be negative.");
            }

            stop.call(nativeAudioScheduledSourceNode, when);
        };
    })(nativeAudioScheduledSourceNode.stop);
};
