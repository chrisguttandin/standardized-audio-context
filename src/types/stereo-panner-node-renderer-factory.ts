import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IStereoPannerNode } from '../interfaces';

export type TStereoPannerNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IStereoPannerNode<T>>;
