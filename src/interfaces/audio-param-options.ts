import { TNativeAudioParam } from '../types';
import { IAudioParamRenderer } from './audio-param-renderer';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioParamOptions {

    audioParamRenderer: IAudioParamRenderer;

    context: IMinimalBaseAudioContext;

    nativeAudioParam: TNativeAudioParam;

}
