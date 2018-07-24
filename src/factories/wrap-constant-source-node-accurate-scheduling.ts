import { TNativeAudioNode, TNativeAudioParam, TWrapConstantSourceNodeAccurateSchedulingFactory } from '../types';

export const createWrapConstantSourceNodeAccurateScheduling: TWrapConstantSourceNodeAccurateSchedulingFactory = (
    createNativeAudioNode
) => {
    return(nativeConstantSourceNode, nativeContext) => {
        const nativeGainNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createGain());

        nativeConstantSourceNode.connect(nativeGainNode);

        const disconnectGainNode = ((disconnect) => {
            return () => {
                disconnect.call(nativeConstantSourceNode, nativeGainNode);
                nativeConstantSourceNode.removeEventListener('ended', disconnectGainNode);
            };
        })(nativeConstantSourceNode.disconnect);

        nativeConstantSourceNode.addEventListener('ended', disconnectGainNode);

        nativeConstantSourceNode.connect = ((destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0) => {
            if (destination instanceof AudioNode) {
                // Bug #11: Safari does not support chaining yet, but that wrapper should not be used in Safari.
                return nativeGainNode.connect.call(nativeGainNode, destination, output, input);
            }

            // @todo This return statement is necessary to satisfy TypeScript.
            return nativeGainNode.connect.call(nativeGainNode, destination, output);
        });

        nativeConstantSourceNode.disconnect = function () {
            nativeGainNode.disconnect.apply(nativeGainNode, arguments);
        };

        let startTime = 0;
        let stopTime: null | number = null;

        const scheduleEnvelope = () => {
            nativeGainNode.gain.cancelScheduledValues(0);
            nativeGainNode.gain.setValueAtTime(0, 0);

            if (stopTime === null || startTime < stopTime) {
                nativeGainNode.gain.setValueAtTime(1, startTime);
            }

            if (stopTime !== null && startTime < stopTime) {
                nativeGainNode.gain.setValueAtTime(0, stopTime);
            }
        };

        nativeConstantSourceNode.start = ((start) => {
            return (when = 0) => {
                start.call(nativeConstantSourceNode, when);
                startTime = when;

                scheduleEnvelope();
            };
        })(nativeConstantSourceNode.start);

        nativeConstantSourceNode.stop = ((stop) => {
            return (when = 0) => {
                stop.call(nativeConstantSourceNode, when);
                stopTime = when;

                scheduleEnvelope();
            };
        })(nativeConstantSourceNode.stop);
    };
};
