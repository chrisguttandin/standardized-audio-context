import { AUDIO_GRAPH } from '../globals';
import { IAudioNode } from '../interfaces';
import { TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';

export const renderInputsOfAudioNode = (
    audioNode: IAudioNode,
    offlineAudioContext: TUnpatchedOfflineAudioContext,
    nativeAudioNode: TNativeAudioNode
) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(audioNode.context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    const entryOfAudioNode = audioGraphOfContext.nodes.get(audioNode);

    if (entryOfAudioNode === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    return Promise
        .all(Array
            .from(entryOfAudioNode.inputs.values())
            .map(([ source, output, input ]) => {
                const entryOfSource = audioGraphOfContext.nodes.get(source);

                if (entryOfSource === undefined) {
                    throw new Error('Missing the entry of this AudioParam in the audio graph.');
                }

                return entryOfSource.renderer
                    .render(source, offlineAudioContext)
                    .then((node) => node.connect(nativeAudioNode, output, input));
            }));
};
