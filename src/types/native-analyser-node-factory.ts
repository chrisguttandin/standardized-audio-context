import { IAnalyserOptions } from '../interfaces';
import { TNativeAnalyserNode } from './native-analyser-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeAnalyserNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IAnalyserOptions>
) => TNativeAnalyserNode;
