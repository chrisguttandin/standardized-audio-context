import { IConstantSourceNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export type TConstantSourceNodeRendererFactory = <T extends IMinimalOfflineAudioContext>() => IConstantSourceNodeRenderer<T>;
