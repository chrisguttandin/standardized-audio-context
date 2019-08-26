import { IAudioParam } from '../interfaces';
import { TNativeAudioParam } from './native-audio-param';

export type TIsAnyAudioParamFunction = (anything: any) => anything is IAudioParam | TNativeAudioParam;
