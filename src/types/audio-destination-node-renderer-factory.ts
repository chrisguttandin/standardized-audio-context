import { IAudioDestinationNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';
import { TRenderInputsOfAudioNodeFunction } from './render-inputs-of-audio-node-function';

export type TAudioDestinationNodeRendererFactory = <T extends IMinimalOfflineAudioContext>(
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => IAudioNodeRenderer<T, IAudioDestinationNode<T>>;
