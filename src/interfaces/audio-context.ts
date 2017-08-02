import { IAnalyserNode } from './analyser-node';
import { IBaseAudioContext } from './base-audio-context';
import { IOscillatorNode } from './oscillator-node';

export interface IAudioContext extends IBaseAudioContext {

    close(): Promise<void>;

    // @todo This should move into the IBaseAudioContext interface.
    createAnalyser(): IAnalyserNode;

    // @todo This should move into the IBaseAudioContext interface.
    createChannelMerger(numberOfInputs: number): ChannelMergerNode;

    // @todo This should move into the IBaseAudioContext interface.
    createChannelSplitter(numberOfOutputs: number): ChannelSplitterNode;

    // @todo This should move into the IBaseAudioContext interface.
    createOscillator(): IOscillatorNode;

}
