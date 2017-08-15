import { TNativeAudioParam } from '../types';
import { IAudioParamRenderer } from './audio-param-renderer';

export interface IAudioParamOptions {

    audioParamRenderer: IAudioParamRenderer;

    nativeAudioParam?: TNativeAudioParam;

}
