import { createInvalidStateError } from '../factories/invalid-state-error';
import { TNativeAudioBufferSourceNode } from '../types';

export const wrapAudioBufferSourceNodeStartMethodConsecutiveCalls = (audioBufferSourceNode: TNativeAudioBufferSourceNode): void => {
    audioBufferSourceNode.start = ((start) => {
        let isScheduled = false;

        return (when = 0, offset = 0, duration?: number) => {
            if (isScheduled) {
                throw createInvalidStateError();
            }

            start.call(audioBufferSourceNode, when, offset, duration);

            isScheduled = true;
        };
    })(audioBufferSourceNode.start);
};
