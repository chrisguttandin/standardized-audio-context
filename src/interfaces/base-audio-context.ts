import { TDecodeErrorCallback, TDecodeSuccessCallback } from '../types';
import { IAnalyserNode } from './analyser-node';
import { IAudioBufferSourceNode } from './audio-buffer-source-node';
import { IAudioNode } from './audio-node';
import { IAudioWorklet } from './audio-worklet';
import { IBiquadFilterNode } from './biquad-filter-node';
import { IConstantSourceNode } from './constant-source-node';
import { IConvolverNode } from './convolver-node';
import { IDelayNode } from './delay-node';
import { IDynamicsCompressorNode } from './dynamics-compressor-node';
import { IGainNode } from './gain-node';
import { IIIRFilterNode } from './iir-filter-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IOscillatorNode } from './oscillator-node';
import { IPeriodicWave } from './periodic-wave';
import { IPeriodicWaveConstraints } from './periodic-wave-constraints';
import { IStereoPannerNode } from './stereo-panner-node';
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

    createConvolver (): IConvolverNode;

    createDelay (maxDelayTime?: number): IDelayNode;

    createDynamicsCompressor (): IDynamicsCompressorNode;

    createGain (): IGainNode;

    createIIRFilter (feedforward: number[], feedback: number[]): IIIRFilterNode;

    createOscillator (): IOscillatorNode;

    createPeriodicWave (real: number[], imag: number[], constraints?: Partial<IPeriodicWaveConstraints>): IPeriodicWave;

    createStereoPanner (): IStereoPannerNode;

    createWaveShaper (): IWaveShaperNode;

    decodeAudioData (
        audioData: ArrayBuffer,
        successCallback?: TDecodeSuccessCallback,
        errorCallback?: TDecodeErrorCallback
    ): Promise<AudioBuffer>;

}
