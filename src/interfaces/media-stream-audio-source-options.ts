import { IAudioNodeOptions } from './audio-node-options';

export interface IMediaStreamAudioSourceOptions extends IAudioNodeOptions {

    mediaStream: MediaStream;

}
