import { IAutomation } from './automation';

export interface ILinearRampToValueAutomation extends IAutomation {

    endTime: number;

    type: 'linearRampToValue';

    value: number;

}
