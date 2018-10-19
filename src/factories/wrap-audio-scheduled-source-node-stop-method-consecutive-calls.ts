import { interceptConnections } from '../helpers/intercept-connections';
import { TWrapAudioScheduledSourceNodeStopMethodConsecutiveCallsFactory } from '../types';

export const createWrapAudioScheduledSourceNodeStopMethodConsecutiveCalls:
    TWrapAudioScheduledSourceNodeStopMethodConsecutiveCallsFactory =
(
    createNativeAudioNode
) => {
    return (nativeAudioScheduledSourceNode, nativeContext) => {
        const nativeGainNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createGain());

        nativeAudioScheduledSourceNode.connect(nativeGainNode);

        const disconnectGainNode = ((disconnect) => {
            return () => {
                disconnect.call(nativeAudioScheduledSourceNode, nativeGainNode);
                (<any> nativeAudioScheduledSourceNode).removeEventListener('ended', disconnectGainNode);
            };
        })(nativeAudioScheduledSourceNode.disconnect);

        (<any> nativeAudioScheduledSourceNode).addEventListener('ended', disconnectGainNode);

        interceptConnections(nativeAudioScheduledSourceNode, nativeGainNode);

        nativeAudioScheduledSourceNode.stop = ((stop) => {
            let isStopped = false;

            return (when = 0) => {
                if (isStopped) {
                    try {
                        stop.call(nativeAudioScheduledSourceNode, when);
                    } catch {
                        nativeGainNode.gain.setValueAtTime(0, when);
                    }
                } else {
                    stop.call(nativeAudioScheduledSourceNode, when);

                    isStopped = true;
                }
            };
        })(nativeAudioScheduledSourceNode.stop);
    };
};
