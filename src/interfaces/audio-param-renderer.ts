import { TAutomation, TNativeAudioParam } from '../types';

export interface IAudioParamRenderer {

    record (automation: TAutomation): void;

    render (audioParam: TNativeAudioParam): void;

}
