import {
    ICancelScheduledValuesAutomation,
    IExponentialRampToValueAutomation,
    ILinearRampToValueAutomation,
    ISetTargetAutomation,
    ISetValueAutomation,
    ISetValueCurveAutomation
} from '../interfaces';

export type TAutomation = ICancelScheduledValuesAutomation |
    IExponentialRampToValueAutomation |
    ILinearRampToValueAutomation |
    ISetTargetAutomation |
    ISetValueAutomation |
    ISetValueCurveAutomation;
