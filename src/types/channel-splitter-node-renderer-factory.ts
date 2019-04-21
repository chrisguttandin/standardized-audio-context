import { IAudioNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export type TChannelSplitterNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IAudioNode<T>>;
