import { IAudioNodeRenderer, IAudioParamRenderer } from '../interfaces';
import { TAutomation, TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';

export class AudioParamRenderer implements IAudioParamRenderer {

    private _automations: TAutomation[];

    private _sources: Map<IAudioNodeRenderer, number>;

    constructor () {
        this._automations = [];
        this._sources = new Map();
    }

    public unwire (source: IAudioNodeRenderer): void {
        this._sources.delete(source);
    }

    public wire (source: IAudioNodeRenderer, output: number): void {
        this._sources.set(source, output);
    }

    public record (automation: TAutomation) {
        // @todo Order automations.
        this._automations.push(automation);
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext, audioParam: TNativeAudioParam): Promise<void> {
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

        return Promise
            .all(Array
                .from(this._sources)
                .map(([ source, output ]) => source
                    .render(offlineAudioContext)
                    .then((node) => node.connect(audioParam, output))))
            .then(() => undefined);
    }

}
