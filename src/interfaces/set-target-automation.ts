import { IAutomation } from './automation';

export interface ISetTargetAutomation extends IAutomation {

    startTime: number;

    target: number;

    timeConstant: number;

    type: 'setTarget';

}
