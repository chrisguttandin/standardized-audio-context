import { IIIRFilterOptions } from '../interfaces';
import { TNativeIIRFilterNode } from './native-iir-filter-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeIIRFilterNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: IIIRFilterOptions
) => TNativeIIRFilterNode;
