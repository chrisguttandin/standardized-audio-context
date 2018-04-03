import { IAudioBufferSourceOptions } from '../interfaces';
import { TNativeAudioBufferSourceNode } from './native-audio-buffer-source-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeAudioBufferSourceNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IAudioBufferSourceOptions>
) => TNativeAudioBufferSourceNode;
