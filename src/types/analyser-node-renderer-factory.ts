import { IAnalyserNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export type TAnalyserNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IAnalyserNode<T>>;
