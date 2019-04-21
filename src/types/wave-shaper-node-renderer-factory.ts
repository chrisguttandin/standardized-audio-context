import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IWaveShaperNode } from '../interfaces';

export type TWaveShaperNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IWaveShaperNode<T>>;
