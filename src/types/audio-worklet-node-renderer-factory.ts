import { IAudioNodeRenderer, IAudioWorkletNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';

export type TAudioWorkletNodeRendererFactory = <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(
    name: string
) => IAudioNodeRenderer<T, IAudioWorkletNode<T>>;
