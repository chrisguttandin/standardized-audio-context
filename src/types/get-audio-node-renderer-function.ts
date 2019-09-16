import { IAudioNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export type TGetAudioNodeRendererFunction = <T extends IMinimalOfflineAudioContext>(
    audioNode: IAudioNode<T>
) => IAudioNodeRenderer<T, IAudioNode<T>>;
