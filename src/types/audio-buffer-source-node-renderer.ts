import { IAudioBufferSourceNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';

export type TAudioBufferSourceNodeRenderer<T extends IMinimalBaseAudioContext> = T extends IMinimalOfflineAudioContext
    ? IAudioBufferSourceNodeRenderer<T>
    : null;
