import {
    IAnalyserNodeConstructor,
    IAudioBufferConstructor,
    IAudioBufferSourceNodeConstructor,
    IBaseAudioContextConstructor,
    IBiquadFilterNodeConstructor,
    IChannelMergerNodeConstructor,
    IChannelSplitterNodeConstructor,
    IConstantSourceNodeConstructor,
    IGainNodeConstructor,
    IIIRFilterNodeConstructor,
    IMinimalBaseAudioContextConstructor,
    IOscillatorNodeConstructor,
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
    decodeAudioData: TDecodeAudioDataFunction,
    gainNodeConstructor: IGainNodeConstructor,
    iIRFilterNodeConstructor: IIIRFilterNodeConstructor,
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    oscillatorNodeConstructor: IOscillatorNodeConstructor,
    stereoPannerNodeConstructor: IStereoPannerNodeConstructor,
    waveShaperNodeConstructor: IWaveShaperNodeConstructor
) => IBaseAudioContextConstructor;
