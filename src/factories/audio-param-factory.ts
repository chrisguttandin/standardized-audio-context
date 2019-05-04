import { AUDIO_PARAM_AUDIO_NODE_STORE, AUDIO_PARAM_STORE } from '../globals';
import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioNode, IAudioParam, IAudioParamRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TAudioParamFactoryFactory, TNativeAudioParam } from '../types';

const addAudioParam = <T extends IMinimalBaseAudioContext>(
    context: T,
    audioParam: IAudioParam,
    audioParamRenderer: T extends IMinimalOfflineAudioContext ? IAudioParamRenderer : null
) => {
    const audioGraph = getAudioGraph(context);

    audioGraph.params.set(audioParam, { activeInputs: new Set(), passiveInputs: new WeakMap(), renderer: audioParamRenderer });
};

export const createAudioParamFactory: TAudioParamFactoryFactory = (createAudioParamRenderer, nativeAudioContextConstructor) => {
    return <T extends IMinimalBaseAudioContext>(
        audioNode: IAudioNode<T>,
        isAudioParamOfOfflineAudioContext: boolean,
        nativeAudioParam: TNativeAudioParam,
        maxValue: null | number = null,
        minValue: null | number = null
    ): IAudioParam => {
        const audioParamRenderer = (isAudioParamOfOfflineAudioContext) ? createAudioParamRenderer() : null;
        const audioParam = {
            get defaultValue (): number {
                return nativeAudioParam.defaultValue;
            },
            get maxValue (): number {
                return (maxValue === null) ? nativeAudioParam.maxValue : maxValue;
            },
            get minValue (): number {
                return (minValue === null) ? nativeAudioParam.minValue : minValue;
            },
            get value (): number {
                return nativeAudioParam.value;
            },
            set value (value) {
                nativeAudioParam.value = value;

                // Bug #98: Edge, Firefox & Safari do not yet treat the value setter like a call to setValueAtTime().
                audioParam.setValueAtTime(value, audioNode.context.currentTime);
            },
            cancelScheduledValues (cancelTime: number): IAudioParam {
                nativeAudioParam.cancelScheduledValues(cancelTime);

                if (audioParamRenderer !== null) {
                    audioParamRenderer.record({ cancelTime, type: 'cancelScheduledValues' });
                }

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
                const type = 'setValueCurve';

                /*
                 * Bug #152: Safari does not correctly interpolate the values of the curve.
                 * @todo Unfortunately there is no way to test for this behavior in synchronous fashion which is why testing for the
                 * existence of the webkitAudioContext is used as a workaround here.
                 */
                if (nativeAudioContextConstructor !== null && nativeAudioContextConstructor.name === 'webkitAudioContext') {
                    const endTime = startTime + duration;
                    const sampleRate = audioNode.context.sampleRate;
                    const firstSample = Math.ceil(startTime * sampleRate);
                    const lastSample = Math.floor((endTime) * sampleRate);
                    const numberOfInterpolatedValues = lastSample - firstSample;
                    const interpolatedValues = new Float32Array(numberOfInterpolatedValues);

                    for (let i = 0; i < numberOfInterpolatedValues; i += 1) {
                        const theoreticIndex = ((values.length - 1) / duration) * (((firstSample + i) / sampleRate) - startTime);
                        const lowerIndex = Math.floor(theoreticIndex);
                        const upperIndex = Math.ceil(theoreticIndex);

                        interpolatedValues[i] = (lowerIndex === upperIndex)
                            ? values[lowerIndex]
                            : ((1 - (theoreticIndex - lowerIndex)) * values[lowerIndex])
                                + ((1 - (upperIndex - theoreticIndex)) * values[upperIndex]);
                    }

                    nativeAudioParam.setValueCurveAtTime(interpolatedValues, startTime, duration);

                    if (audioParamRenderer !== null) {
                        audioParamRenderer.record({ duration, startTime, type, values: interpolatedValues });
                    }

                    const timeOfLastSample = lastSample / sampleRate;

                    if (timeOfLastSample < endTime) {
                        audioParam.setValueAtTime(interpolatedValues[interpolatedValues.length - 1], timeOfLastSample);
                    }

                    audioParam.setValueAtTime(values[values.length - 1], endTime);
                } else {
                    nativeAudioParam.setValueCurveAtTime(values, startTime, duration);

                    if (audioParamRenderer !== null) {
                        audioParamRenderer.record({ duration, startTime, type, values });
                    }
                }

                return audioParam;
            }
        };

        AUDIO_PARAM_STORE.set(audioParam, nativeAudioParam);
        AUDIO_PARAM_AUDIO_NODE_STORE.set(audioParam, audioNode);

        addAudioParam(
            audioNode.context,
            audioParam,
            <T extends IMinimalOfflineAudioContext ? IAudioParamRenderer : null> audioParamRenderer
        );

        return audioParam;
    };
};
