import { TNativeAudioParam } from '../types';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioParamOptions {

    context: IMinimalBaseAudioContext;

    maxValue: null | number;

    minValue: null | number;

    nativeAudioParam: TNativeAudioParam;

}
