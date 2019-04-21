import { IAudioBufferSourceNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export type TAudioBufferSourceNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IAudioBufferSourceNodeRenderer<T>;
