import { IAudioParamRenderer } from '../interfaces';
import { TAutomation, TNativeAudioParam } from '../types';

export class AudioParamRenderer implements IAudioParamRenderer {

    private _automations: TAutomation[];

    constructor () {
        this._automations = [];
    }

    public record (automation: TAutomation) {
        // @todo Order automations.
        this._automations.push(automation);
    }

    public render (audioParam: TNativeAudioParam) {
        for (const automation of this._automations) {
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

                audioParam.setValueCurveAtTime(values, startTime, duration);
            } else {
                throw new Error("Can't apply an unkown automation.");
            }
        }
    }

}
