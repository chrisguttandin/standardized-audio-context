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
    IOscillatorNodeConstructor
} from '../interfaces';

export type TBaseAudioContextConstructorFactory = (
    analyserNodeConstructor: IAnalyserNodeConstructor,
    audioBufferConstructor: IAudioBufferConstructor,
    audioBufferSourceNodeConstructor: IAudioBufferSourceNodeConstructor,
    biquadFilterNodeConstructor: IBiquadFilterNodeConstructor,
    channelMergerNodeConstructor: IChannelMergerNodeConstructor,
    channelSplitterNodeConstructor: IChannelSplitterNodeConstructor,
    constantSourceNodeConstructor: IConstantSourceNodeConstructor,
    gainNodeConstructor: IGainNodeConstructor,
    iIRFilterNodeConstructor: IIIRFilterNodeConstructor,
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    oscillatorNodeConstructor: IOscillatorNodeConstructor
) => IBaseAudioContextConstructor;
