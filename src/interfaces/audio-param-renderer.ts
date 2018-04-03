import { TAutomation, TNativeAudioParam } from '../types';
import { IAudioParam } from './audio-param';

export interface IAudioParamRenderer {

    record (automation: TAutomation): void;

    replay (audioParam: IAudioParam | TNativeAudioParam): void;

}
