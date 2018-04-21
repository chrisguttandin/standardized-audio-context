import { AUDIO_GRAPHS } from '../globals';
import { IAudioGraph, IAudioNode } from '../interfaces';
import { TContext, TNativeContext } from '../types';

const disconnectAllInputConnections = (audioGraph: IAudioGraph, audioNode: IAudioNode) => {
    const audioNodeConnections = audioGraph.nodes.get(audioNode);

    if (audioNodeConnections !== undefined) {
        const numberOfInputs = audioNodeConnections.inputs.length;

        for (let i = 0; i < numberOfInputs; i += 1) {
            const connections = audioNodeConnections.inputs[i];

            for (const [ source ] of Array.from(connections)) {
                // @todo Disconnect the exact connection with its output and input parameters.
                source.disconnect(audioNode);

                disconnectAllInputConnections(audioGraph, source);
            }
        }
    }
};

export const deleteAudioGraph = (context: TContext, nativeContext: TNativeContext): void => {
    const audioGraph = AUDIO_GRAPHS.get(context);

    if (audioGraph !== undefined) {
        disconnectAllInputConnections(audioGraph, context.destination);
    }

    AUDIO_GRAPHS.delete(context);
    AUDIO_GRAPHS.delete(nativeContext);
};
