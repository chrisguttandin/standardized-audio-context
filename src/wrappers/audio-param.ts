import { AudioParam } from '../audio-param';
import { AUDIO_PARAM_RENDERER_STORE } from '../globals';
import { IMinimalBaseAudioContext } from '../interfaces';
import { AudioParamRenderer } from '../renderers/audio-param';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

export class AudioParamWrapper {

    public wrap (audioNode: TNativeAudioNode, context: IMinimalBaseAudioContext, property: string) {
        const nativeAudioParam = <TNativeAudioParam> (<any> audioNode)[property];
        const audioParamRenderer = new AudioParamRenderer();
        const audioParam = new AudioParam({ audioParamRenderer, context, nativeAudioParam });

        AUDIO_PARAM_RENDERER_STORE.set(audioParam, audioParamRenderer);

        Object.defineProperty(audioNode, property, {
            get: () => audioParam
        });
    }

}

export const AUDIO_PARAM_WRAPPER_PROVIDER = { deps: [ ], provide: AudioParamWrapper };
