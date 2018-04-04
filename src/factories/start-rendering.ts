import { AUDIO_GRAPH } from '../globals';
import { TStartRenderingFactory } from '../types';

export const createStartRendering: TStartRenderingFactory = (renderNativeOfflineAudioContext) => {
    return (destination, nativeOfflineAudioContext) => {
        const audioGraphOfContext = AUDIO_GRAPH.get(destination.context);

        if (audioGraphOfContext === undefined) {
            throw new Error('Missing the audio graph of the OfflineAudioContext.');
        }

        const entryOfDestination = audioGraphOfContext.nodes.get(destination);

        if (entryOfDestination === undefined) {
            throw new Error('Missing the entry of this AudioNode in the audio graph.');
        }

        return entryOfDestination.renderer
            .render(destination, nativeOfflineAudioContext)
            .then(() => renderNativeOfflineAudioContext(nativeOfflineAudioContext));
    };
};
