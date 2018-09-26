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
import { IWaveShaperNode } from './wave-shaper-node';

export interface IBaseAudioContext extends IMinimalBaseAudioContext {

    // @todo listener

    // The audioWorklet property is only available in a SecureContext.
    readonly audioWorklet?: IAudioWorklet;

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

    createWaveShaper (): IWaveShaperNode;

    decodeAudioData (
        audioData: ArrayBuffer,
        successCallback?: TDecodeSuccessCallback,
        errorCallback?: TDecodeErrorCallback
    ): Promise<AudioBuffer>;

}
