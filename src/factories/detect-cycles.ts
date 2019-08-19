import { isAudioNode } from '../guards/audio-node';
import { isDelayNode } from '../guards/delay-node';
import { TDetectCyclesFactory } from '../types';

export const createDetectCycles: TDetectCyclesFactory = (
    audioParamAudioNodeStore,
    createNotSupportedError,
    getAudioNodeConnections,
    getValueForKey
) => {
    return function detectCycles (source, destination): boolean {
        const audioNodeOfDestination = (isAudioNode(destination))
            ? destination
            : getValueForKey(audioParamAudioNodeStore, destination);

        if (source === audioNodeOfDestination) {
            throw createNotSupportedError();
        }

        if (isDelayNode(audioNodeOfDestination)) {
            return true;
        }

        const { outputs } = getAudioNodeConnections(audioNodeOfDestination);

        for (const outputConnection of outputs) {
            if (detectCycles(source, outputConnection[0])) {
                return true;
            }
        }

        return false;
    };
};
