import { IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';
import { getAudioNodeRenderer } from './get-audio-node-renderer';
import { getAudioParamConnections } from './get-audio-param-connections';

export const renderInputsOfAudioParam = <T extends IMinimalOfflineAudioContext>(
    context: T,
    audioParam: IAudioParam,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamConnections = getAudioParamConnections<T>(context, audioParam);

    return Promise
        .all(Array
            .from(audioParamConnections.activeInputs)
            .map(([ source, output ]) => {
                return getAudioNodeRenderer(source)
                    .render(source, nativeOfflineAudioContext)
                    .then((node) => node.connect(nativeAudioParam, output));
            }));
};
