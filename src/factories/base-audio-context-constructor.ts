import {
    IAnalyserNode,
    IAudioBuffer,
    IAudioBufferSourceNode,
    IAudioNode,
    IAudioWorklet,
    IBaseAudioContext,
    IBiquadFilterNode,
    IConstantSourceNode,
    IConvolverNode,
    IDelayNode,
    IDynamicsCompressorNode,
    IGainNode,
    IIIRFilterNode,
    IOscillatorNode,
    IPannerNode,
    IPeriodicWave,
    IPeriodicWaveConstraints,
    IStereoPannerNode,
    IWaveShaperNode,
    IWorkletOptions
} from '../interfaces';
import { TBaseAudioContextConstructorFactory, TDecodeErrorCallback, TDecodeSuccessCallback, TNativeContext, TTypedArray } from '../types';

export const createBaseAudioContextConstructor: TBaseAudioContextConstructorFactory = (
    addAudioWorkletModule,
    analyserNodeConstructor,
    audioBufferConstructor,
    audioBufferSourceNodeConstructor,
    biquadFilterNodeConstructor,
    channelMergerNodeConstructor,
    channelSplitterNodeConstructor,
    constantSourceNodeConstructor,
    convolverNodeConstructor,
    decodeAudioData,
    delayNodeConstructor,
    dynamicsCompressorNodeConstructor,
    gainNodeConstructor,
    iIRFilterNodeConstructor,
    minimalBaseAudioContextConstructor,
    oscillatorNodeConstructor,
    pannerNodeConstructor,
    periodicWaveConstructor,
    stereoPannerNodeConstructor,
    waveShaperNodeConstructor
) => {

    return class BaseAudioContext extends minimalBaseAudioContextConstructor implements IBaseAudioContext {

        private _audioWorklet: undefined | IAudioWorklet;

        constructor (private _nativeContext: TNativeContext, numberOfChannels: number) {
            super(_nativeContext, numberOfChannels);

            this._audioWorklet = (addAudioWorkletModule === undefined) ?
                undefined :
                { addModule: (moduleURL: string, options?: IWorkletOptions) => addAudioWorkletModule(this, moduleURL, options) };
        }

        get audioWorklet (): undefined | IAudioWorklet {
            return this._audioWorklet;
        }

        public createAnalyser (): IAnalyserNode<this> {
            return new analyserNodeConstructor(this);
        }

        public createBiquadFilter (): IBiquadFilterNode<this> {
            return new biquadFilterNodeConstructor(this);
        }

        public createBuffer (numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
            return new audioBufferConstructor({ length, numberOfChannels, sampleRate });
        }

        public createBufferSource (): IAudioBufferSourceNode<this> {
            return new audioBufferSourceNodeConstructor(this);
        }

        public createChannelMerger (numberOfInputs = 6): IAudioNode<this> {
            return new channelMergerNodeConstructor(this, { numberOfInputs });
        }

        public createChannelSplitter (numberOfOutputs = 6): IAudioNode<this> {
            return new channelSplitterNodeConstructor(this, { numberOfOutputs });
        }

        public createConstantSource (): IConstantSourceNode<this> {
            return new constantSourceNodeConstructor(this);
        }

        public createConvolver (): IConvolverNode<this> {
            return new convolverNodeConstructor(this);
        }

        public createDelay (maxDelayTime = 1): IDelayNode<this> {
            return new delayNodeConstructor(this, { maxDelayTime });
        }

        public createDynamicsCompressor (): IDynamicsCompressorNode<this> {
            return new dynamicsCompressorNodeConstructor(this);
        }

        public createGain (): IGainNode<this> {
            return new gainNodeConstructor(this);
        }

        public createIIRFilter (feedforward: number[] | TTypedArray, feedback: number[] | TTypedArray): IIIRFilterNode<this> {
            return new iIRFilterNodeConstructor(this, { feedback, feedforward });
        }

        public createOscillator (): IOscillatorNode<this> {
            return new oscillatorNodeConstructor(this);
        }

        public createPanner (): IPannerNode<this> {
            return new pannerNodeConstructor(this);
        }

        public createPeriodicWave (
            real: number[],
            imag: number[],
            constraints: Partial<IPeriodicWaveConstraints> = { disableNormalization: false }
        ): IPeriodicWave {
            return new periodicWaveConstructor(this, { ...constraints, imag, real });
        }

        public createStereoPanner (): IStereoPannerNode<this> {
            return new stereoPannerNodeConstructor(this);
        }

        public createWaveShaper (): IWaveShaperNode<this> {
            return new waveShaperNodeConstructor(this);
        }

        public decodeAudioData (
            audioData: ArrayBuffer, successCallback?: TDecodeSuccessCallback, errorCallback?: TDecodeErrorCallback
        ): Promise<IAudioBuffer> {
            return decodeAudioData(this._nativeContext, audioData)
                .then((audioBuffer) => {
                    if (typeof successCallback === 'function') {
                        successCallback(audioBuffer);
                    }

                    return audioBuffer;
                })
                .catch((err) => {
                    if (typeof errorCallback === 'function') {
                        errorCallback(err);
                    }

                    throw err; // tslint:disable-line:rxjs-throw-error
                });
        }

    };

};
