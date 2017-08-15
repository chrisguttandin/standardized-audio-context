import { IAutomation } from './automation';

export interface IExponentialRampToValueAutomation extends IAutomation {

    endTime: number;

    type: 'exponentialRampToValue';

    value: number;

}
