import { IAudioParam } from '../interfaces';
import { TAudioParamRendererFactory, TAutomation, TNativeAudioParam } from '../types';

export const createAudioParamRenderer: TAudioParamRendererFactory = () => {
    const automations: TAutomation[] = [ ];

    return {
        record (automation: TAutomation): void {
            automations.push(automation);
        },
        replay (audioParam: IAudioParam | TNativeAudioParam): void {
            for (const automation of automations) {
                if (automation.type === 'exponentialRampToValue') {
                    const { endTime, value } = automation;

                    audioParam.exponentialRampToValueAtTime(value, endTime);
                } else if (automation.type === 'linearRampToValue') {
                    const { endTime, value } = automation;

                    audioParam.linearRampToValueAtTime(value, endTime);
                } else if (automation.type === 'setTarget') {
                    const { startTime, target, timeConstant } = automation;

                    audioParam.setTargetAtTime(target, startTime, timeConstant);
                } else if (automation.type === 'setValue') {
                    const { startTime, value } = automation;

                    audioParam.setValueAtTime(value, startTime);
                } else if (automation.type === 'setValueCurve') {
                    const { duration, startTime, values } = automation;

                    // @todo TypeScript is expecting values to be an array of numbers.
                    (<any> audioParam).setValueCurveAtTime(values, startTime, duration);
                } else {
                    throw new Error("Can't apply an unkown automation.");
                }
            }
        }
    };
};
