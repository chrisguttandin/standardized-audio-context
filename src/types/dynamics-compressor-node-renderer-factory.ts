import { IAudioNodeRenderer, IDynamicsCompressorNode, IMinimalOfflineAudioContext } from '../interfaces';

export type TDynamicsCompressorNodeRendererFactory =
    <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IDynamicsCompressorNode<T>>;
