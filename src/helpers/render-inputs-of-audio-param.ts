import { getAudioNodeRenderer } from '../helpers/get-audio-node-renderer';
import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { IAudioParam } from '../interfaces';
import { TContext, TNativeAudioParam, TNativeOfflineAudioContext } from '../types';

export const renderInputsOfAudioParam = (
    context: TContext,
    audioParam: IAudioParam,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamConnections = getAudioParamConnections(context, audioParam);

    return Promise
        .all(Array
            .from(audioParamConnections.inputs)
            .map(([ source, output ]) => {
                const audioNodeRenderer = getAudioNodeRenderer(source);

                return audioNodeRenderer
                    .render(source, nativeOfflineAudioContext)
                    .then((node) => node.connect(nativeAudioParam, output));
            }));
};
