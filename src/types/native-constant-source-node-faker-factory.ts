import { IConstantSourceOptions, INativeConstantSourceNodeFaker } from '../interfaces';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeConstantSourceNodeFakerFactory = (
    unpatchedAudioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IConstantSourceOptions>
) => INativeConstantSourceNodeFaker;
