import {
    IExponentialRampToValueAutomation,
    ILinearRampToValueAutomation,
    ISetTargetAutomation,
    ISetValueAutomation,
    ISetValueCurveAutomation
} from '../interfaces';

export type TAutomation = IExponentialRampToValueAutomation |
    ILinearRampToValueAutomation |
    ISetTargetAutomation |
    ISetValueAutomation |
    ISetValueCurveAutomation;
