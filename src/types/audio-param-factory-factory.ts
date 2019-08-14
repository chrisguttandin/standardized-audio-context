// @todo Renaming the imports is currently necessary to avoid collissions with the parameter names.
import {
    createCancelScheduledValuesAutomationEvent as createCancelScheduledValuesAutomationEventFunction,
    createExponentialRampToValueAutomationEvent as createExponentialRampToValueAutomationEventFunction,
    createLinearRampToValueAutomationEvent as createLinearRampToValueAutomationEventFunction,
    createSetTargetAutomationEvent as createSetTargetAutomationEventFunction,
    createSetValueAutomationEvent as createSetValueAutomationEventFunction,
    createSetValueCurveAutomationEvent as createSetValueCurveAutomationEventFunction
} from 'automation-events';
import { TAudioParamFactory } from './audio-param-factory';
import { TAudioParamRendererFactory } from './audio-param-renderer-factory';
import { TNativeAudioContextConstructor } from './native-audio-context-constructor';

export type TAudioParamFactoryFactory = (
    createAudioParamRenderer: TAudioParamRendererFactory,
    createCancelScheduledValuesAutomationEvent: typeof createCancelScheduledValuesAutomationEventFunction,
    createExponentialRampToValueAutomationEvent: typeof createExponentialRampToValueAutomationEventFunction,
    createLinearRampToValueAutomationEvent: typeof createLinearRampToValueAutomationEventFunction,
    createSetTargetAutomationEvent: typeof createSetTargetAutomationEventFunction,
    createSetValueAutomationEvent: typeof createSetValueAutomationEventFunction,
    createSetValueCurveAutomationEvent: typeof createSetValueCurveAutomationEventFunction,
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => TAudioParamFactory;
