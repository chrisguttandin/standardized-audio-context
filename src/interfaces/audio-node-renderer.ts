import { TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';

export interface IAudioNodeRenderer {

    render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode>;

    unwire (source: IAudioNodeRenderer): void;

    wire (source: IAudioNodeRenderer, output: number, input: number): void;

}
