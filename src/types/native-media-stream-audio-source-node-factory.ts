import { IMediaStreamAudioSourceOptions } from '../interfaces';
import { TNativeContext } from './native-context';
import { TNativeMediaStreamAudioSourceNode } from './native-media-stream-audio-source-node';

export type TNativeMediaStreamAudioSourceNodeFactory = (
    nativeContext: TNativeContext,
    options: IMediaStreamAudioSourceOptions
) => TNativeMediaStreamAudioSourceNode;
