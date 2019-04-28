import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { getAudioNodeRenderer } from '../helpers/get-audio-node-renderer';
import { IAudioNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TInternalStateEventListener, TNativeAudioNode, TNativeOfflineAudioContext } from '../types';

export const renderInputsOfAudioNode = <T extends IMinimalOfflineAudioContext>(
    audioNode: IAudioNode<T>,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioNode: TNativeAudioNode
) => {
    const audioNodeConnections = getAudioNodeConnections(audioNode);

    return Promise
        .all(audioNodeConnections.inputs
            .map((connections, input) => Array
                .from(connections.values())
                .filter((connection): connection is [ IAudioNode<T>, null | TInternalStateEventListener, number ] => {
                    return (typeof connection[0] !== 'symbol');
                })
                .map(([ source, , output ]) => getAudioNodeRenderer(source)
                    .render(source, nativeOfflineAudioContext)
                    .then((node) => node.connect(nativeAudioNode, output, input))))
            .reduce((allRenderingPromises, renderingPromises) => [ ...allRenderingPromises, ...renderingPromises ], [ ]));
};
