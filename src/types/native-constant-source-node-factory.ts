import { IConstantSourceOptions, INativeConstantSourceNode } from '../interfaces';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeConstantSourceNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IConstantSourceOptions>
) => INativeConstantSourceNode;
