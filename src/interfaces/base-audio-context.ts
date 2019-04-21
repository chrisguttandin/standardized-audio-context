import { TDecodeErrorCallback, TDecodeSuccessCallback } from '../types';
import { IAnalyserNode } from './analyser-node';
import { IAudioBuffer } from './audio-buffer';
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
import { IPannerNode } from './panner-node';
import { IPeriodicWave } from './periodic-wave';
import { IPeriodicWaveConstraints } from './periodic-wave-constraints';
import { IStereoPannerNode } from './stereo-panner-node';
import { IWaveShaperNode } from './wave-shaper-node';

export interface IBaseAudioContext extends IMinimalBaseAudioContext {

    // The audioWorklet property is only available in a SecureContext.
    readonly audioWorklet?: IAudioWorklet;

    createAnalyser (): IAnalyserNode<this>;

    createBiquadFilter (): IBiquadFilterNode<this>;

    createBuffer (numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer;

    createBufferSource (): IAudioBufferSourceNode<this>;

    createChannelMerger (numberOfInputs?: number): IAudioNode<this>;

    createChannelSplitter (numberOfOutputs?: number): IAudioNode<this>;

    createConstantSource (): IConstantSourceNode<this>;

    createConvolver (): IConvolverNode<this>;

    createDelay (maxDelayTime?: number): IDelayNode<this>;

    createDynamicsCompressor (): IDynamicsCompressorNode<this>;

    createGain (): IGainNode<this>;

    createIIRFilter (feedforward: number[], feedback: number[]): IIIRFilterNode<this>;

    createOscillator (): IOscillatorNode<this>;

    createPanner (): IPannerNode<this>;

    createPeriodicWave (real: number[], imag: number[], constraints?: Partial<IPeriodicWaveConstraints>): IPeriodicWave;

    createStereoPanner (): IStereoPannerNode<this>;

    createWaveShaper (): IWaveShaperNode<this>;

    decodeAudioData (
        audioData: ArrayBuffer,
        successCallback?: TDecodeSuccessCallback,
        errorCallback?: TDecodeErrorCallback
    ): Promise<AudioBuffer>;

}
