import { IAudioNodeRenderer, IDelayNode, IMinimalOfflineAudioContext } from '../interfaces';

export type TDelayNodeRendererFactory = <T extends IMinimalOfflineAudioContext>(
    maxDelayTime: number
) => IAudioNodeRenderer<T, IDelayNode<T>>;
