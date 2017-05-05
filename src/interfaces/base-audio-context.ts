import { TDecodeErrorCallback, TDecodeSuccessCallback, TStateChangeEventHandler } from '../types';
import { IAudioBufferSourceNode } from './audio-buffer-source-node';
import { IAudioDestinationNode } from './audio-destination-node';
import { IBiquadFilterNode } from './biquad-filter-node';
import { IGainNode } from './gain-node';
import { IIIRFilterNode } from './iir-filter-node';

export interface IBaseAudioContext /* extends EventTarget */ {

    readonly currentTime: number;

    readonly destination: IAudioDestinationNode;

    // @todo listener

    onstatechange: null | TStateChangeEventHandler;

    readonly sampleRate: number;

    readonly state: AudioContextState;

    createBiquadFilter(): IBiquadFilterNode;

    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;

    createBufferSource(): IAudioBufferSourceNode;

    createGain(): IGainNode;

    createIIRFilter(feedforward: number[], feedback: number[]): IIIRFilterNode;

    decodeAudioData(
        audioData: ArrayBuffer,
        successCallback?: TDecodeSuccessCallback,
        errorCallback?: TDecodeErrorCallback
    ): Promise<AudioBuffer>;

}
