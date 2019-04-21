import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IPannerNode } from '../interfaces';

export type TPannerNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IPannerNode<T>>;
