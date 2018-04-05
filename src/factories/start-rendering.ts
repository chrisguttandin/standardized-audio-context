import { getAudioNodeRenderer } from '../helpers/get-audio-node-renderer';
import { TStartRenderingFactory } from '../types';

export const createStartRendering: TStartRenderingFactory = (renderNativeOfflineAudioContext) => {
    return (destination, nativeOfflineAudioContext) => getAudioNodeRenderer(destination)
        .render(destination, nativeOfflineAudioContext)
        .then(() => renderNativeOfflineAudioContext(nativeOfflineAudioContext));
};
