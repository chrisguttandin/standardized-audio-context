import { addAudioWorkletModule } from '../add-audio-worklet-module';
import { AnalyserNode } from '../audio-nodes/analyser-node';
import { AudioBufferSourceNode } from '../audio-nodes/audio-buffer-source-node';
import { BiquadFilterNode } from '../audio-nodes/biquad-filter-node';
import { ChannelMergerNode } from '../audio-nodes/channel-merger-node';
import { ChannelSplitterNode } from '../audio-nodes/channel-splitter-node';
import { ConstantSourceNode } from '../audio-nodes/constant-source-node';
import { GainNode } from '../audio-nodes/gain-node';
import { IIRFilterNode } from '../audio-nodes/iir-filter-node';
import { OscillatorNode } from '../audio-nodes/oscillator-node';
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
import {
    TBaseAudioContextConstructorFactory,
    TDecodeErrorCallback,
    TDecodeSuccessCallback,
    TTypedArray,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';

export const createBaseAudioContextConstructor: TBaseAudioContextConstructorFactory = (
    audioBufferConstructor,
    minimalBaseAudioContextConstructor
) => {

    return class BaseAudioContext extends minimalBaseAudioContextConstructor implements IBaseAudioContext {

        private _audioWorklet: IAudioWorklet;

        private _context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext;

        constructor (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfChannels: number) {
            super(context, numberOfChannels);

            this._audioWorklet = {
                addModule: (moduleURL: string, options?: IWorkletOptions) => addAudioWorkletModule(this, moduleURL, options)
            };
            this._context = context;
        }

        get audioWorklet (): IAudioWorklet {
            return this._audioWorklet;
        }

        public createAnalyser (): IAnalyserNode {
            return new AnalyserNode(this);
        }

        public createBiquadFilter (): IBiquadFilterNode {
            return new BiquadFilterNode(this);
        }

        public createBuffer (numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
            return new audioBufferConstructor({ length, numberOfChannels, sampleRate });
        }

        public createBufferSource (): IAudioBufferSourceNode {
            return new AudioBufferSourceNode(this);
        }

        public createChannelMerger (numberOfInputs = 6) {
            return new ChannelMergerNode(this, { numberOfInputs });
        }

        public createChannelSplitter (numberOfOutputs = 6) {
            return new ChannelSplitterNode(this, { numberOfOutputs });
        }

        public createConstantSource () {
            return new ConstantSourceNode(this);
        }

        public createGain (): IGainNode {
            return new GainNode(this);
        }

        public createIIRFilter (feedforward: number[] | TTypedArray, feedback: number[] | TTypedArray): IIIRFilterNode {
            return new IIRFilterNode(this, { feedback, feedforward });
        }

        public createOscillator (): IOscillatorNode {
            return new OscillatorNode(this);
        }

        public decodeAudioData (
            audioData: ArrayBuffer, successCallback?: TDecodeSuccessCallback, errorCallback?: TDecodeErrorCallback
        ): Promise<IAudioBuffer> {
            return decodeAudioData(this._context, audioData)
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
