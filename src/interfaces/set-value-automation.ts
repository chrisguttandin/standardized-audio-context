import { IAutomation } from './automation';

export interface ISetValueAutomation extends IAutomation {

    startTime: number;

    type: 'setValue';

    value: number;

}
