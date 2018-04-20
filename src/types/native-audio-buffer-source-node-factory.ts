import { IAudioBufferSourceOptions } from '../interfaces';
import { TNativeAudioBufferSourceNode } from './native-audio-buffer-source-node';
import { TNativeContext } from './native-context';

export type TNativeAudioBufferSourceNodeFactory = (
    nativeContext: TNativeContext,
    // @todo Do only accept the full IAudioBufferSourceOptions dictionary.
    options?: Partial<IAudioBufferSourceOptions>
) => TNativeAudioBufferSourceNode;
