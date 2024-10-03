import { AutomationEventList } from 'automation-events';
import { IAudioNode, IAudioParam, IAudioParamRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TAudioParamFactoryFactory, TContext, TNativeAudioParam } from '../types';

export const createAudioParamFactory: TAudioParamFactoryFactory = (
    addAudioParamConnections,
    audioParamAudioNodeStore,
    audioParamStore,
    createAudioParamRenderer,
    createCancelAndHoldAutomationEvent,
    createCancelScheduledValuesAutomationEvent,
    createExponentialRampToValueAutomationEvent,
    createLinearRampToValueAutomationEvent,
    createSetTargetAutomationEvent,
    createSetValueAutomationEvent,
    createSetValueCurveAutomationEvent
) => {
    return <T extends TContext>(
        audioNode: IAudioNode<T>,
        isAudioParamOfOfflineAudioContext: boolean,
        nativeAudioParam: TNativeAudioParam,
        maxValue: null | number = null,
        minValue: null | number = null
    ): IAudioParam => {
        // Bug #196 Only Safari sets the defaultValue to the initial value.
        const defaultValue = nativeAudioParam.value;
        const automationEventList = new AutomationEventList(defaultValue);
        const audioParamRenderer = isAudioParamOfOfflineAudioContext ? createAudioParamRenderer(automationEventList) : null;
        const audioParam = {
            get defaultValue(): number {
                return defaultValue;
            },
            get maxValue(): number {
                return maxValue === null ? nativeAudioParam.maxValue : maxValue;
            },
            get minValue(): number {
                return minValue === null ? nativeAudioParam.minValue : minValue;
            },
            get value(): number {
                return nativeAudioParam.value;
            },
            set value(value) {
                nativeAudioParam.value = value;

                // Bug #98: Firefox does not yet treat the value setter like a call to setValueAtTime().
                audioParam.setValueAtTime(value, audioNode.context.currentTime);
            },
            cancelAndHoldAtTime(cancelTime: number): IAudioParam {
                // Bug #28: Firefox dos not yet implement cancelAndHoldAtTime().
                if (typeof nativeAudioParam.cancelAndHoldAtTime === 'function') {
                    if (audioParamRenderer === null) {
                        automationEventList.flush(audioNode.context.currentTime);
                    }

                    automationEventList.add(createCancelAndHoldAutomationEvent(cancelTime));
                    nativeAudioParam.cancelAndHoldAtTime(cancelTime);
                } else {
                    const previousLastEvent = Array.from(automationEventList).pop();

                    if (audioParamRenderer === null) {
                        automationEventList.flush(audioNode.context.currentTime);
                    }

                    automationEventList.add(createCancelAndHoldAutomationEvent(cancelTime));

                    const currentLastEvent = Array.from(automationEventList).pop();

                    nativeAudioParam.cancelScheduledValues(cancelTime);

                    if (previousLastEvent !== currentLastEvent && currentLastEvent !== undefined) {
                        if (currentLastEvent.type === 'exponentialRampToValue') {
                            nativeAudioParam.exponentialRampToValueAtTime(currentLastEvent.value, currentLastEvent.endTime);
                        } else if (currentLastEvent.type === 'linearRampToValue') {
                            nativeAudioParam.linearRampToValueAtTime(currentLastEvent.value, currentLastEvent.endTime);
                        } else if (currentLastEvent.type === 'setValue') {
                            nativeAudioParam.setValueAtTime(currentLastEvent.value, currentLastEvent.startTime);
                        } else if (currentLastEvent.type === 'setValueCurve') {
                            nativeAudioParam.setValueCurveAtTime(
                                currentLastEvent.values,
                                currentLastEvent.startTime,
                                currentLastEvent.duration
                            );
                        }
                    }
                }

                return audioParam;
            },
            cancelScheduledValues(cancelTime: number): IAudioParam {
                if (audioParamRenderer === null) {
                    automationEventList.flush(audioNode.context.currentTime);
                }

                automationEventList.add(createCancelScheduledValuesAutomationEvent(cancelTime));
                nativeAudioParam.cancelScheduledValues(cancelTime);

                return audioParam;
            },
            exponentialRampToValueAtTime(value: number, endTime: number): IAudioParam {
                const currentTime = audioNode.context.currentTime;

                if (audioParamRenderer === null) {
                    automationEventList.flush(currentTime);
                }

                // Bug #194: Firefox does not implicitly call setValueAtTime() if there is no previous event.
                if (Array.from(automationEventList).length === 0) {
                    automationEventList.add(createSetValueAutomationEvent(defaultValue, currentTime));
                    nativeAudioParam.setValueAtTime(defaultValue, currentTime);
                }

                automationEventList.add(createExponentialRampToValueAutomationEvent(value, endTime));
                nativeAudioParam.exponentialRampToValueAtTime(value, endTime);

                return audioParam;
            },
            linearRampToValueAtTime(value: number, endTime: number): IAudioParam {
                const currentTime = audioNode.context.currentTime;

                if (audioParamRenderer === null) {
                    automationEventList.flush(currentTime);
                }

                // Bug #195: Firefox does not implicitly call setValueAtTime() if there is no previous event.
                if (Array.from(automationEventList).length === 0) {
                    automationEventList.add(createSetValueAutomationEvent(defaultValue, currentTime));
                    nativeAudioParam.setValueAtTime(defaultValue, currentTime);
                }

                automationEventList.add(createLinearRampToValueAutomationEvent(value, endTime));
                nativeAudioParam.linearRampToValueAtTime(value, endTime);

                return audioParam;
            },
            setTargetAtTime(target: number, startTime: number, timeConstant: number): IAudioParam {
                if (audioParamRenderer === null) {
                    automationEventList.flush(audioNode.context.currentTime);
                }

                automationEventList.add(createSetTargetAutomationEvent(target, startTime, timeConstant));
                nativeAudioParam.setTargetAtTime(target, startTime, timeConstant);

                return audioParam;
            },
            setValueAtTime(value: number, startTime: number): IAudioParam {
                if (audioParamRenderer === null) {
                    automationEventList.flush(audioNode.context.currentTime);
                }

                automationEventList.add(createSetValueAutomationEvent(value, startTime));
                nativeAudioParam.setValueAtTime(value, startTime);

                return audioParam;
            },
            setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): IAudioParam {
                if (audioParamRenderer === null) {
                    automationEventList.flush(audioNode.context.currentTime);
                }

                automationEventList.add(createSetValueCurveAutomationEvent(values, startTime, duration));
                nativeAudioParam.setValueCurveAtTime(values, startTime, duration);

                return audioParam;
            }
        };

        audioParamStore.set(audioParam, nativeAudioParam);
        audioParamAudioNodeStore.set(audioParam, audioNode);

        addAudioParamConnections(
            audioParam,
            <T extends IMinimalOfflineAudioContext | IOfflineAudioContext ? IAudioParamRenderer : null>audioParamRenderer
        );

        return audioParam;
    };
};
