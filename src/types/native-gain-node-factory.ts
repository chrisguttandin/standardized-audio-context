import { IGainOptions } from '../interfaces';
import { TNativeGainNode } from './native-gain-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeGainNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IGainOptions>
) => TNativeGainNode;
