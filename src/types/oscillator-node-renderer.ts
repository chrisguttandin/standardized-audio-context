import { IMinimalBaseAudioContext, IMinimalOfflineAudioContext, IOscillatorNodeRenderer } from '../interfaces';

export type TOscillatorNodeRenderer<T extends IMinimalBaseAudioContext> = T extends IMinimalOfflineAudioContext
    ? IOscillatorNodeRenderer<T>
    : null;
