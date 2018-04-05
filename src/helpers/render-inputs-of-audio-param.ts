import { getAudioNodeRenderer } from '../helpers/get-audio-node-renderer';
import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';

export const renderInputsOfAudioParam = (
    context: IMinimalBaseAudioContext,
    audioParam: IAudioParam,
    offlineAudioContext: TNativeOfflineAudioContext,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamConnections = getAudioParamConnections(context, audioParam);

    return Promise
        .all(Array
            .from(audioParamConnections.inputs)
            .map(([ source, output ]) => {
                const audioNodeRenderer = getAudioNodeRenderer(source);

                return audioNodeRenderer
                    .render(source, offlineAudioContext)
                    .then((node) => node.connect(nativeAudioParam, output));
            }));
};
