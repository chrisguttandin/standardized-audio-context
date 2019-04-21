import { IMinimalOfflineAudioContext, IOscillatorNodeRenderer } from '../interfaces';

export type TOscillatorNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IOscillatorNodeRenderer<T>;
