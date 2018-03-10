import { AudioParam } from '../audio-param';
import { AUDIO_PARAM_RENDERER_STORE } from '../globals';
import { AudioParamRenderer } from '../renderers/audio-param';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

export class AudioParamWrapper {

    public wrap (audioNode: TNativeAudioNode, property: string) {
        const nativeAudioParam = <TNativeAudioParam> (<any> audioNode)[property];
        const audioParamRenderer = new AudioParamRenderer();
        const audioParam = new AudioParam({ audioParamRenderer, nativeAudioParam });

        AUDIO_PARAM_RENDERER_STORE.set(audioParam, audioParamRenderer);

        Object.defineProperty(audioNode, property, {
            get: () => audioParam
            // @todo set: () => { throw ... }
        });
    }

}

export const AUDIO_PARAM_WRAPPER_PROVIDER = { deps: [ ], provide: AudioParamWrapper };
