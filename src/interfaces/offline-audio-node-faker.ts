import { TUnpatchedOfflineAudioContext } from '../types';
import { IAudioNode } from './audio-node';

export interface IOfflineAudioNodeFaker {

    render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<AudioNode>;

    unwire (source: IOfflineAudioNodeFaker): void;

    wire (source: IOfflineAudioNodeFaker, output: number, input: number): IAudioNode;

}
