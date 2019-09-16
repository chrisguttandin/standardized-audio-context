import { TRenderInputsOfAudioNodeFactory } from '../types';

export const createRenderInputsOfAudioNode: TRenderInputsOfAudioNodeFactory = (
    getAudioNodeConnections,
    getAudioNodeRenderer,
    isPartOfACycle
) => {
    return async (audioNode, nativeOfflineAudioContext, nativeAudioNode) => {
        const audioNodeConnections = getAudioNodeConnections(audioNode);

        await Promise
            .all(audioNodeConnections.activeInputs
                .map((connections, input) => Array
                    .from(connections)
                    .map(async ([ source, output ]) => {
                        const audioNodeRenderer = getAudioNodeRenderer(source);
                        const renderedNativeAudioNode = await audioNodeRenderer.render(source, nativeOfflineAudioContext);

                        if (!isPartOfACycle(source)) {
                            renderedNativeAudioNode.connect(nativeAudioNode, output, input);
                        }
                    }))
                .reduce((allRenderingPromises, renderingPromises) => [ ...allRenderingPromises, ...renderingPromises ], [ ]));
    };
};
