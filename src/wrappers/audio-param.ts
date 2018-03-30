import { AudioParam } from '../audio-param';
import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

export class AudioParamWrapper {

    public wrap (
        audioNode: TNativeAudioNode,
        context: IMinimalBaseAudioContext,
        nativeAudioParam: TNativeAudioParam,
        property: string,
        maxValue: null | number = null,
        minValue: null | number = null
    ) {
        const audioParam = new AudioParam({ context, maxValue, minValue, nativeAudioParam });

        Object.defineProperty(audioNode, property, {
            get: () => audioParam
        });
    }

}

export const AUDIO_PARAM_WRAPPER_PROVIDER = { deps: [ ], provide: AudioParamWrapper };
