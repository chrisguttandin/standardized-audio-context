import { IConstantSourceNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';

export type TConstantSourceNodeRenderer<T extends IMinimalBaseAudioContext> = T extends IMinimalOfflineAudioContext
    ? IConstantSourceNodeRenderer<T>
    : null;
