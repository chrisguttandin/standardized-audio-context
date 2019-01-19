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

        private _nativeContext: TNativeContext;

        constructor (nativeContext: TNativeContext, numberOfChannels: number) {
            super(nativeContext, numberOfChannels);

            this._audioWorklet = (addAudioWorkletModule === undefined) ?
                undefined :
                { addModule: (moduleURL: string, options?: IWorkletOptions) => addAudioWorkletModule(<any> this, moduleURL, options) };
            this._nativeContext = nativeContext;
        }

        get audioWorklet (): undefined | IAudioWorklet {
            return this._audioWorklet;
        }

        public createAnalyser (): IAnalyserNode {
            return new analyserNodeConstructor(<any> this);
        }

        public createBiquadFilter (): IBiquadFilterNode {
            return new biquadFilterNodeConstructor(<any> this);
        }

        public createBuffer (numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
            return new audioBufferConstructor({ length, numberOfChannels, sampleRate });
        }

        public createBufferSource (): IAudioBufferSourceNode {
            return new audioBufferSourceNodeConstructor(<any> this);
        }

        public createChannelMerger (numberOfInputs = 6): IAudioNode {
            return new channelMergerNodeConstructor(<any> this, { numberOfInputs });
        }

        public createChannelSplitter (numberOfOutputs = 6): IAudioNode {
            return new channelSplitterNodeConstructor(<any> this, { numberOfOutputs });
        }

        public createConstantSource (): IConstantSourceNode {
            return new constantSourceNodeConstructor(<any> this);
        }

        public createConvolver (): IConvolverNode {
            return new convolverNodeConstructor(<any> this);
        }

        public createDelay (maxDelayTime = 1): IDelayNode {
            return new delayNodeConstructor(<any> this, { maxDelayTime });
        }

        public createDynamicsCompressor (): IDynamicsCompressorNode {
            return new dynamicsCompressorNodeConstructor(<any> this);
        }

        public createGain (): IGainNode {
            return new gainNodeConstructor(<any> this);
        }

        public createIIRFilter (feedforward: number[] | TTypedArray, feedback: number[] | TTypedArray): IIIRFilterNode {
            return new iIRFilterNodeConstructor(<any> this, { feedback, feedforward });
        }

        public createOscillator (): IOscillatorNode {
            return new oscillatorNodeConstructor(<any> this);
        }

        public createPanner (): IPannerNode {
            return new pannerNodeConstructor(<any> this);
        }

        public createPeriodicWave (
            real: number[],
            imag: number[],
            constraints: Partial<IPeriodicWaveConstraints> = { disableNormalization: false }
        ): IPeriodicWave {
            return new periodicWaveConstructor(<any> this, { ...constraints, imag, real });
        }

        public createStereoPanner (): IStereoPannerNode {
            return new stereoPannerNodeConstructor(<any> this);
        }

        public createWaveShaper (): IWaveShaperNode {
            return new waveShaperNodeConstructor(<any> this);
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
