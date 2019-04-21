import { IAudioNodeRenderer, IGainNode, IMinimalOfflineAudioContext } from '../interfaces';

export type TGainNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IGainNode<T>>;
