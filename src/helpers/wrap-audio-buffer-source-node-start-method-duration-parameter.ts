import { TNativeAudioBufferSourceNode, TNativeContext } from '../types';

export const wrapAudioBufferSourceNodeStartMethodDurationParameter = (
    nativeAudioScheduledSourceNode: TNativeAudioBufferSourceNode,
    nativeContext: TNativeContext
): void => {
    let endTime = Number.POSITIVE_INFINITY;
    let stopTime = Number.POSITIVE_INFINITY;

    nativeAudioScheduledSourceNode.start = ((start, stop) => {
        return (when = 0, offset = 0, duration = Number.POSITIVE_INFINITY) => {
            start.call(nativeAudioScheduledSourceNode, when, offset);

            if (duration >= 0 && duration < Number.POSITIVE_INFINITY) {
                const actualStartTime = Math.max(when, nativeContext.currentTime);
                // @todo The playbackRate could of course also have been automated and is not always fixed.
                const durationInBufferTime = duration / nativeAudioScheduledSourceNode.playbackRate.value;

                endTime = actualStartTime + durationInBufferTime;

                stop.call(nativeAudioScheduledSourceNode, Math.min(endTime, stopTime));
            }
        };
    })(nativeAudioScheduledSourceNode.start, nativeAudioScheduledSourceNode.stop);

    nativeAudioScheduledSourceNode.stop = ((stop) => {
        return (when = 0) => {
            stopTime = Math.max(when, nativeContext.currentTime);

            stop.call(nativeAudioScheduledSourceNode, Math.min(endTime, stopTime));
        };
    })(nativeAudioScheduledSourceNode.stop);
};
