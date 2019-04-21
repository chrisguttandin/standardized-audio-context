import { IAudioNodeRenderer, IConvolverNode, IMinimalOfflineAudioContext } from '../interfaces';

export type TConvolverNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IConvolverNode<T>>;
