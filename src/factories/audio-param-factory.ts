import { AUDIO_GRAPH, AUDIO_PARAM_STORE } from '../globals';
import { IAudioParam, IAudioParamRenderer, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioParamFactoryFactory } from '../types';

const addAudioParam = (context: IMinimalBaseAudioContext, audioParam: IAudioParam, audioParamRenderer: IAudioParamRenderer) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    audioGraphOfContext.params.set(audioParam, { inputs: new Set(), renderer: audioParamRenderer });
};

export const createAudioParamFactory: TAudioParamFactoryFactory = (createAudioParamRenderer) => {
    return (context, isAudioParamOfOfflineAudioContext, nativeAudioParam, maxValue = null, minValue = null) => {
        const audioParamRenderer = (isAudioParamOfOfflineAudioContext) ? createAudioParamRenderer() : null;
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

        if (audioParamRenderer !== null) {
            addAudioParam(context, audioParam, audioParamRenderer);
        }

        AUDIO_PARAM_STORE.set(audioParam, nativeAudioParam);

        return audioParam;
    };
};
