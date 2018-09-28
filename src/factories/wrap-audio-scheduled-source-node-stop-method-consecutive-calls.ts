import { TNativeAudioNode, TNativeAudioParam, TWrapAudioScheduledSourceNodeStopMethodConsecutiveCallsFactory } from '../types';

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

        nativeAudioScheduledSourceNode.connect = ((destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0) => {
            if (destination instanceof AudioNode) {
                nativeGainNode.connect.call(nativeGainNode, destination, output, input);

                // Bug #11: Safari does not support chaining yet.
                return destination;
            }

            // @todo This return statement is necessary to satisfy TypeScript.
            return nativeGainNode.connect.call(nativeGainNode, destination, output);
        });

        nativeAudioScheduledSourceNode.disconnect = function () {
            nativeGainNode.disconnect.apply(nativeGainNode, arguments);
        };

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
