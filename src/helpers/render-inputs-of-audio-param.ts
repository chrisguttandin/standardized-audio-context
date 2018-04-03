import { AUDIO_GRAPH } from '../globals';
import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';

export const renderInputsOfAudioParam = (
    context: IMinimalBaseAudioContext,
    audioParam: IAudioParam,
    offlineAudioContext: TUnpatchedOfflineAudioContext,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    const entryOfAudioParam = audioGraphOfContext.params.get(audioParam);

    if (entryOfAudioParam === undefined) {
        throw new Error('Missing the entry of this AudioParam in the audio graph.');
    }

    return Promise
        .all(Array
            .from(entryOfAudioParam.inputs.values())
            .map(([ source, output ]) => {
                const entryOfSource = audioGraphOfContext.nodes.get(source);

                if (entryOfSource === undefined) {
                    throw new Error('Missing the entry of this AudioParam in the audio graph.');
                }

                return entryOfSource.renderer
                    .render(source, offlineAudioContext)
                    .then((node) => node.connect(nativeAudioParam, output));
            }));
};
