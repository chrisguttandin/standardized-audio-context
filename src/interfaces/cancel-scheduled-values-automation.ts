import { IAutomation } from './automation';

export interface ICancelScheduledValuesAutomation extends IAutomation {

    cancelTime: number;

    type: 'cancelScheduledValues';

}
