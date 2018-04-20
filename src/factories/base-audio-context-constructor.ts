import { addAudioWorkletModule } from '../add-audio-worklet-module';
import { decodeAudioData } from '../decode-audio-data';
import {
    IAnalyserNode,
    IAudioBuffer,
    IAudioBufferSourceNode,
    IAudioWorklet,
    IBaseAudioContext,
    IBiquadFilterNode,
    IGainNode,
    IIIRFilterNode,
    IOscillatorNode,
    IWorkletOptions
} from '../interfaces';
import { TBaseAudioContextConstructorFactory, TDecodeErrorCallback, TDecodeSuccessCallback, TNativeContext, TTypedArray } from '../types';

export const createBaseAudioContextConstructor: TBaseAudioContextConstructorFactory = (
    analyserNodeConstructor,
    audioBufferConstructor,
    audioBufferSourceNodeConstructor,
    biquadFilterNodeConstructor,
    channelMergerNodeConstructor,
    channelSplitterNodeConstructor,
    constantSourceNodeConstructor,
    gainNodeConstructor,
    iIRFilterNodeConstructor,
    minimalBaseAudioContextConstructor,
    oscillatorNodeConstructor
) => {

    return class BaseAudioContext extends minimalBaseAudioContextConstructor implements IBaseAudioContext {

        private _audioWorklet: IAudioWorklet;

        private _nativeContext: TNativeContext;

        constructor (nativeContext: TNativeContext, numberOfChannels: number) {
            super(nativeContext, numberOfChannels);

            this._audioWorklet = {
                addModule: (moduleURL: string, options?: IWorkletOptions) => addAudioWorkletModule(<any> this, moduleURL, options)
            };
            this._nativeContext = nativeContext;
        }

        get audioWorklet (): IAudioWorklet {
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

        public createChannelMerger (numberOfInputs = 6) {
            return new channelMergerNodeConstructor(<any> this, { numberOfInputs });
        }

        public createChannelSplitter (numberOfOutputs = 6) {
            return new channelSplitterNodeConstructor(<any> this, { numberOfOutputs });
        }

        public createConstantSource () {
            return new constantSourceNodeConstructor(<any> this);
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

                    throw err;
                });
        }

    };

};
