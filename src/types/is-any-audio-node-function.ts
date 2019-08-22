import { IAudioNode } from '../interfaces';
import { TNativeAudioNode } from './native-audio-node';

export type TIsAnyAudioNodeFunction = (anything: any) => anything is IAudioNode<any> | TNativeAudioNode;
