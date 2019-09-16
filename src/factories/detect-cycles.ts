import { isAudioNode } from '../guards/audio-node';
import { isDelayNode } from '../guards/delay-node';
import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TDetectCyclesFactory } from '../types';

export const createDetectCycles: TDetectCyclesFactory = (
    audioParamAudioNodeStore,
    getAudioNodeConnections,
    getValueForKey
) => {
    return function detectCycles <T extends IMinimalBaseAudioContext> (
        source: IAudioNode<T>,
        destination: IAudioNode<T> | IAudioParam,
        chain: IAudioNode<T>[] = [ source ]
    ): IAudioNode<T>[][] {
        const audioNodeOfDestination = (isAudioNode(destination))
            ? destination
            : <IAudioNode<T>> getValueForKey(audioParamAudioNodeStore, destination);

        if (isDelayNode(audioNodeOfDestination)) {
            return [ ];
        }

        if (source === audioNodeOfDestination) {
            return [ chain ];
        }

        const { outputs } = getAudioNodeConnections(audioNodeOfDestination);

        return Array
            .from(outputs)
            .map((outputConnection) => detectCycles(source, outputConnection[0], [ ...chain, audioNodeOfDestination ]))
            .reduce((mergedCycles, nestedCycles) => mergedCycles.concat(nestedCycles), [ ]);
    };
};
