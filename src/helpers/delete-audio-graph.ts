import { AUDIO_GRAPHS } from '../globals';
import { TContext, TNativeContext } from '../types';
import { disconnectAudioNodeInputConnections } from './disconnect-audio-node-input-connections';

export const deleteAudioGraph = (context: TContext, nativeContext: TNativeContext): void => {
    const audioGraph = AUDIO_GRAPHS.get(context);

    if (audioGraph !== undefined) {
        disconnectAudioNodeInputConnections(audioGraph, context.destination);
    }

    AUDIO_GRAPHS.delete(context);
    AUDIO_GRAPHS.delete(nativeContext);
};
