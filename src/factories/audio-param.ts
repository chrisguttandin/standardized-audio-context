import { AUDIO_PARAM_CONTEXT_STORE, AUDIO_PARAM_RENDERER_STORE, AUDIO_PARAM_STORE } from '../globals';
import { IAudioParam } from '../interfaces';
import { AudioParamRenderer } from '../renderers/audio-param';
import { TAudioParamFactory } from '../types';

export const createAudioParam: TAudioParamFactory = (
    context,
    isAudioParamOfOfflineAudioContext,
    nativeAudioParam,
    maxValue = null,
    minValue = null
) => {
    const audioParamRenderer = (isAudioParamOfOfflineAudioContext) ? new AudioParamRenderer() : null;
    const audioParam = {
        get defaultValue () {
            return nativeAudioParam.defaultValue;
        },
        get maxValue () {
            return (maxValue === null) ? nativeAudioParam.maxValue : maxValue;
        },
        get minValue () {
            return (minValue === null) ? nativeAudioParam.minValue : minValue;
        },
        get value () {
            return nativeAudioParam.value;
        },
        set value (value) {
            nativeAudioParam.value = value;

            if (audioParamRenderer !== null) {
                audioParamRenderer.record({ startTime: context.currentTime, type: 'setValue', value });
            }
        },
        cancelScheduledValues (cancelTime: number): IAudioParam {
            nativeAudioParam.cancelScheduledValues(cancelTime);

            // @todo

            return audioParam;
        },
        exponentialRampToValueAtTime (value: number, endTime: number): IAudioParam {
            nativeAudioParam.exponentialRampToValueAtTime(value, endTime);

            if (audioParamRenderer !== null) {
                audioParamRenderer.record({ endTime, type: 'exponentialRampToValue', value });
            }

            return audioParam;
        },
        linearRampToValueAtTime (value: number, endTime: number): IAudioParam {
            nativeAudioParam.linearRampToValueAtTime(value, endTime);

            if (audioParamRenderer !== null) {
                audioParamRenderer.record({ endTime, type: 'linearRampToValue', value });
            }

            return audioParam;
        },
        setTargetAtTime (target: number, startTime: number, timeConstant: number): IAudioParam {
            nativeAudioParam.setTargetAtTime(target, startTime, timeConstant);

            if (audioParamRenderer !== null) {
                audioParamRenderer.record({ startTime, target, timeConstant, type: 'setTarget' });
            }

            return audioParam;
        },
        setValueAtTime (value: number, startTime: number): IAudioParam {
            nativeAudioParam.setValueAtTime(value, startTime);

            if (audioParamRenderer !== null) {
                audioParamRenderer.record({ startTime, type: 'setValue', value });
            }

            return audioParam;
        },
        setValueCurveAtTime (values: Float32Array, startTime: number, duration: number): IAudioParam {
            // @todo TypeScript is expecting values to be an array of numbers.
            nativeAudioParam.setValueCurveAtTime(<any> values, startTime, duration);

            if (audioParamRenderer !== null) {
                audioParamRenderer.record({ duration, startTime, type: 'setValueCurve', values });
            }

            return audioParam;
        }
    };

    AUDIO_PARAM_CONTEXT_STORE.set(audioParam, context);

    if (audioParamRenderer !== null) {
        AUDIO_PARAM_RENDERER_STORE.set(audioParam, audioParamRenderer);
    }

    AUDIO_PARAM_STORE.set(audioParam, nativeAudioParam);

    return audioParam;
};
