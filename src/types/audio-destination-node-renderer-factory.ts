import { IAudioDestinationNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export type TAudioDestinationNodeRendererFactory =
    <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IAudioDestinationNode<T>>;
