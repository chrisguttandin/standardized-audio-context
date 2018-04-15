import { TNativeAudioBufferSourceNode, TNativeConstantSourceNode, TNativeOscillatorNode } from '../types';

export const wrapAudioScheduledSourceNodeStopMethodNegativeParameters = (
    audioScheduledSourceNode: TNativeAudioBufferSourceNode | TNativeConstantSourceNode | TNativeOscillatorNode
): void => {
    audioScheduledSourceNode.stop = ((stop) => {
        return (when = 0) => {
            if (when < 0) {
                throw new RangeError("The parameter can't be negative.");
            }

            stop.call(audioScheduledSourceNode, when);
        };
    })(audioScheduledSourceNode.stop);
};
