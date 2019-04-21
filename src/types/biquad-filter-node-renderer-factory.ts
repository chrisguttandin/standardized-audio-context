import { IAudioNodeRenderer, IBiquadFilterNode, IMinimalOfflineAudioContext } from '../interfaces';

export type TBiquadFilterNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioNodeRenderer<T, IBiquadFilterNode<T>>;
