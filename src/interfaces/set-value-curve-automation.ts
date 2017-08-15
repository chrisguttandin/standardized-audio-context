import { IAutomation } from './automation';

export interface ISetValueCurveAutomation extends IAutomation {

    duration: number;

    startTime: number;

    type: 'setValueCurve';

    values: Float32Array;

}
