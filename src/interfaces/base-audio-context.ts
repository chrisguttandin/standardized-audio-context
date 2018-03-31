import { TDecodeErrorCallback, TDecodeSuccessCallback } from '../types';
import { IAnalyserNode } from './analyser-node';
import { IAudioBufferSourceNode } from './audio-buffer-source-node';
import { IAudioNode } from './audio-node';
import { IAudioWorklet } from './audio-worklet';
import { IBiquadFilterNode } from './biquad-filter-node';
import { IConstantSourceNode } from './constant-source-node';
import { IGainNode } from './gain-node';
import { IIIRFilterNode } from './iir-filter-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IOscillatorNode } from './oscillator-node';

export interface IBaseAudioContext extends IMinimalBaseAudioContext {

    // @todo listener

    audioWorklet: IAudioWorklet;

    createAnalyser (): IAnalyserNode;

    createBiquadFilter (): IBiquadFilterNode;

    createBuffer (numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;

    createBufferSource (): IAudioBufferSourceNode;

    createChannelMerger (numberOfInputs?: number): IAudioNode;

    createChannelSplitter (numberOfOutputs?: number): IAudioNode;

    createConstantSource (): IConstantSourceNode;

    createGain (): IGainNode;

    createIIRFilter (feedforward: number[], feedback: number[]): IIIRFilterNode;

    createOscillator (): IOscillatorNode;

    decodeAudioData (
        audioData: ArrayBuffer,
        successCallback?: TDecodeSuccessCallback,
        errorCallback?: TDecodeErrorCallback
    ): Promise<AudioBuffer>;

}
