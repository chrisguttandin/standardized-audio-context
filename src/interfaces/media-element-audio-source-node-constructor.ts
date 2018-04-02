import { IAudioContext } from './audio-context';
import { IMediaElementAudioSourceNode } from './media-element-audio-source-node';
import { IMediaElementAudioSourceOptions } from './media-element-audio-source-options';
import { IMinimalAudioContext } from './minimal-audio-context';

export interface IMediaElementAudioSourceNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext,
        options: IMediaElementAudioSourceOptions
    ): IMediaElementAudioSourceNode;

}
