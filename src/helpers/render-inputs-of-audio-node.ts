import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { getAudioNodeRenderer } from '../helpers/get-audio-node-renderer';
import { IAudioNode } from '../interfaces';
import { TNativeAudioNode, TNativeOfflineAudioContext } from '../types';

export const renderInputsOfAudioNode = (
    audioNode: IAudioNode,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioNode: TNativeAudioNode
) => {
    const audioNodeConnections = getAudioNodeConnections(audioNode);

    return Promise
        .all(audioNodeConnections.inputs
            .map((connections, input) => Array
                .from(connections.values())
                .map(([ source, output ]) => getAudioNodeRenderer(source)
                    .render(source, nativeOfflineAudioContext)
                    .then((node) => node.connect(nativeAudioNode, output, input))))
            .reduce((allRenderingPromises, renderingPromises) => [ ...allRenderingPromises, ...renderingPromises ], [ ]));
};
