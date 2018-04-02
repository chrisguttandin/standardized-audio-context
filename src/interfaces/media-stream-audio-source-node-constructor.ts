import { IAudioContext } from './audio-context';
import { IMediaStreamAudioSourceNode } from './media-stream-audio-source-node';
import { IMediaStreamAudioSourceOptions } from './media-stream-audio-source-options';
import { IMinimalAudioContext } from './minimal-audio-context';

export interface IMediaStreamAudioSourceNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext,
        options: IMediaStreamAudioSourceOptions
    ): IMediaStreamAudioSourceNode;

}
