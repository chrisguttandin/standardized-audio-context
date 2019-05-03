import { IAudioNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioNode, TNativeOfflineAudioContext } from '../types';
import { getAudioNodeConnections } from './get-audio-node-connections';
import { getAudioNodeRenderer } from './get-audio-node-renderer';

export const renderInputsOfAudioNode = <T extends IMinimalOfflineAudioContext>(
    audioNode: IAudioNode<T>,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioNode: TNativeAudioNode
) => {
    const audioNodeConnections = getAudioNodeConnections(audioNode);

    return Promise
        .all(audioNodeConnections.activeInputs
            .map((connections, input) => Array
                .from(connections)
                .map(([ source, output ]) => {
                    return getAudioNodeRenderer(source)
                        .render(source, nativeOfflineAudioContext)
                        .then((node) => node.connect(nativeAudioNode, output, input));
                }))
            .reduce((allRenderingPromises, renderingPromises) => [ ...allRenderingPromises, ...renderingPromises ], [ ]));
};
