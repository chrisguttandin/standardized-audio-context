import { TAutomation, TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';
import { IAudioNodeRenderer } from './audio-node-renderer';

export interface IAudioParamRenderer {

    record (automation: TAutomation): void;

    render (offlineAudioContext: TUnpatchedOfflineAudioContext, audioParam: TNativeAudioParam): Promise<void>;

    unwire (source: IAudioNodeRenderer): void;

    wire (source: IAudioNodeRenderer, output: number): void;

}
