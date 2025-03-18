// @todo Renaming the imports is currently necessary to avoid collissions with the parameter names.
import {
    createCancelAndHoldAutomationEvent as createCancelAndHoldAutomationEventFunction,
    createCancelScheduledValuesAutomationEvent as createCancelScheduledValuesAutomationEventFunction,
    createExponentialRampToValueAutomationEvent as createExponentialRampToValueAutomationEventFunction,
    createLinearRampToValueAutomationEvent as createLinearRampToValueAutomationEventFunction,
    createSetTargetAutomationEvent as createSetTargetAutomationEventFunction,
    createSetValueAutomationEvent as createSetValueAutomationEventFunction,
    createSetValueCurveAutomationEvent as createSetValueCurveAutomationEventFunction
} from 'automation-events';
import { TAddAudioParamConnectionsFunction } from './add-audio-param-connections-function';
import { TAudioParamAudioNodeStore } from './audio-param-audio-node-store';
import { TAudioParamFactory } from './audio-param-factory';
import { TAudioParamStore } from './audio-param-store';

export type TAudioParamFactoryFactory = (
    addAudioParamConnections: TAddAudioParamConnectionsFunction,
    audioParamAudioNodeStore: TAudioParamAudioNodeStore,
    audioParamStore: TAudioParamStore,
    createCancelAndHoldAutomationEvent: typeof createCancelAndHoldAutomationEventFunction,
    createCancelScheduledValuesAutomationEvent: typeof createCancelScheduledValuesAutomationEventFunction,
    createExponentialRampToValueAutomationEvent: typeof createExponentialRampToValueAutomationEventFunction,
    createLinearRampToValueAutomationEvent: typeof createLinearRampToValueAutomationEventFunction,
    createSetTargetAutomationEvent: typeof createSetTargetAutomationEventFunction,
    createSetValueAutomationEvent: typeof createSetValueAutomationEventFunction,
    createSetValueCurveAutomationEvent: typeof createSetValueCurveAutomationEventFunction
) => TAudioParamFactory;
