import { TAutomation, TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';
import { IAudioNodeRenderer } from './audio-node-renderer';
import { IAudioParam } from './audio-param';

export interface IAudioParamRenderer {

    connect (offlineAudioContext: TUnpatchedOfflineAudioContext, audioParam: TNativeAudioParam): Promise<void>;

    record (automation: TAutomation): void;

    replay (audioParam: IAudioParam | TNativeAudioParam): void;

    render (offlineAudioContext: TUnpatchedOfflineAudioContext, audioParam: TNativeAudioParam): Promise<void>;

    unwire (source: IAudioNodeRenderer): void;

    wire (source: IAudioNodeRenderer, output: number): void;

}
