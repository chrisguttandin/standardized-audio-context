import { IIIRFilterOptions, INativeIIRFilterNodeFaker } from '../interfaces';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeIIRFilterNodeFakerFactory = (
    unpatchedAudioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: IIIRFilterOptions
) => INativeIIRFilterNodeFaker;
