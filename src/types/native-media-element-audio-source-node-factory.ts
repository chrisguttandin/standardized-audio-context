import { IMediaElementAudioSourceOptions } from '../interfaces';
import { TNativeContext } from './native-context';
import { TNativeMediaElementAudioSourceNode } from './native-media-element-audio-source-node';

export type TNativeMediaElementAudioSourceNodeFactory = (
    nativeContext: TNativeContext,
    options: IMediaElementAudioSourceOptions
) => TNativeMediaElementAudioSourceNode;
