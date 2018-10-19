import { interceptConnections } from '../helpers/intercept-connections';
import { TWrapConstantSourceNodeAccurateSchedulingFactory } from '../types';

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

        interceptConnections(nativeConstantSourceNode, nativeGainNode);

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
