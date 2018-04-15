import { INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeOscillatorNode } from '../types';

export const wrapAudioScheduledSourceNodeStartMethodNegativeParameters = (
    audioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode
): void => {
    audioScheduledSourceNode.start = ((start) => {
        return (when = 0, offset = 0, duration?: number) => {
            if ((typeof duration === 'number' && duration < 0) || offset < 0 || when < 0) {
                throw new RangeError("The parameters can't be negative.");
            }

            start.call(audioScheduledSourceNode, when, offset, duration);
        };
    })(audioScheduledSourceNode.start);
};
