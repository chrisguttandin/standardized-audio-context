import { INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeOscillatorNode } from '../types';

export const wrapAudioScheduledSourceNodeStartMethodNegativeParameters = (
    nativeAudioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode
): void => {
    nativeAudioScheduledSourceNode.start = ((start) => {
        return (when = 0, offset = 0, duration?: number) => {
            if ((typeof duration === 'number' && duration < 0) || offset < 0 || when < 0) {
                throw new RangeError("The parameters can't be negative.");
            }

            start.call(nativeAudioScheduledSourceNode, when, offset, duration);
        };
    })(nativeAudioScheduledSourceNode.start);
};
