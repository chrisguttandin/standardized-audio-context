import {
    IAnalyserNodeConstructor,
    IAudioBufferConstructor,
    IAudioBufferSourceNodeConstructor,
    IBaseAudioContextConstructor,
    IBiquadFilterNodeConstructor,
    IChannelMergerNodeConstructor,
    IChannelSplitterNodeConstructor,
    IConstantSourceNodeConstructor,
    IConvolverNodeConstructor,
    IDelayNodeConstructor,
    IDynamicsCompressorNodeConstructor,
    IGainNodeConstructor,
    IIIRFilterNodeConstructor,
    IMinimalBaseAudioContextConstructor,
    IOscillatorNodeConstructor,
    IPeriodicWaveConstructor,
    IStereoPannerNodeConstructor,
    IWaveShaperNodeConstructor
} from '../interfaces';
import { TAddAudioWorkletModuleFunction } from './add-audio-worklet-module-function';
import { TDecodeAudioDataFunction } from './decode-audio-data-function';

export type TBaseAudioContextConstructorFactory = (
    addAudioWorkletModule: undefined | TAddAudioWorkletModuleFunction,
    analyserNodeConstructor: IAnalyserNodeConstructor,
    audioBufferConstructor: IAudioBufferConstructor,
    audioBufferSourceNodeConstructor: IAudioBufferSourceNodeConstructor,
    biquadFilterNodeConstructor: IBiquadFilterNodeConstructor,
    channelMergerNodeConstructor: IChannelMergerNodeConstructor,
    channelSplitterNodeConstructor: IChannelSplitterNodeConstructor,
    constantSourceNodeConstructor: IConstantSourceNodeConstructor,
    convolverNodeConstructor: IConvolverNodeConstructor,
    decodeAudioData: TDecodeAudioDataFunction,
    delayNodeConstructor: IDelayNodeConstructor,
    dynamicsCompressorNodeConstructor: IDynamicsCompressorNodeConstructor,
    gainNodeConstructor: IGainNodeConstructor,
    iIRFilterNodeConstructor: IIIRFilterNodeConstructor,
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    oscillatorNodeConstructor: IOscillatorNodeConstructor,
    periodicWaveConstructor: IPeriodicWaveConstructor,
    stereoPannerNodeConstructor: IStereoPannerNodeConstructor,
    waveShaperNodeConstructor: IWaveShaperNodeConstructor
) => IBaseAudioContextConstructor;
