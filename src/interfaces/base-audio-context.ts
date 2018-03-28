import { TDecodeErrorCallback, TDecodeSuccessCallback } from '../types';
import { IAudioBufferSourceNode } from './audio-buffer-source-node';
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

    createBiquadFilter (): IBiquadFilterNode;

    createBuffer (numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;

    createBufferSource (): IAudioBufferSourceNode;

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
