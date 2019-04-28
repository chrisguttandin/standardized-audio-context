import { getAudioNodeRenderer } from '../helpers/get-audio-node-renderer';
import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { IAudioNode, IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TInternalStateEventListener, TNativeAudioParam, TNativeOfflineAudioContext } from '../types';

export const renderInputsOfAudioParam = <T extends IMinimalOfflineAudioContext>(
    context: T,
    audioParam: IAudioParam,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamConnections = getAudioParamConnections<T>(context, audioParam);

    return Promise
        .all(Array
            .from(audioParamConnections.inputs)
            .filter((connection): connection is [ IAudioNode<T>, null | TInternalStateEventListener, number ] => {
                return (typeof connection[0] !== 'symbol');
            })
            .map(([ source, , output ]) => {
                const audioNodeRenderer = getAudioNodeRenderer(source);

                return audioNodeRenderer
                    .render(source, nativeOfflineAudioContext)
                    .then((node) => node.connect(nativeAudioParam, output));
            }));
};
