import { AudioParam } from '../audio-param';
import { RENDERER_STORE } from '../globals';
import { IAudioNode } from '../interfaces';
import { AudioParamRenderer } from '../renderers/audio-param';
import { TNativeAudioParam } from '../types';

export class AudioParamWrapper {

    public wrap (audioNode: IAudioNode, property: string) {
        const nativeAudioParam = <TNativeAudioParam> (<any> audioNode)[property];
        const audioParamRenderer = new AudioParamRenderer();
        const audioParam = new AudioParam({ audioParamRenderer, nativeAudioParam });

        RENDERER_STORE.set(audioParam, audioParamRenderer);

        Object.defineProperty(audioNode, property, {
            get: () => audioParam
            // @todo set: () => { throw ... }
        });
    }

}
