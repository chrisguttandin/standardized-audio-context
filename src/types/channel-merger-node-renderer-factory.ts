import { IAudioNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export type TChannelMergerNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IAudioNode<T>>;
