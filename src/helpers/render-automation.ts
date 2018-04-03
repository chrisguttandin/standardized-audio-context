import { AUDIO_GRAPH } from '../globals';
import { renderInputsOfAudioParam } from '../helpers/render-inputs-of-audio-param';
import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';

export const renderAutomation = (
    context: IMinimalBaseAudioContext,
    nativeOfflineAudioContext: TUnpatchedOfflineAudioContext,
    audioParam: IAudioParam,
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

    entryOfAudioParam.renderer.replay(nativeAudioParam);

    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
