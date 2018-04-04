import { IAudioBufferSourceOptions } from '../interfaces';
import { TNativeAudioBufferSourceNode } from './native-audio-buffer-source-node';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeAudioBufferSourceNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    // @todo Do only accept the full IAudioBufferSourceOptions dictionary.
    options?: Partial<IAudioBufferSourceOptions>
) => TNativeAudioBufferSourceNode;
