import { IBaseAudioContext } from '../interfaces';
import { TNativeContext } from './native-context';

export type TBaseAudioContextConstructor = new (nativeContext: TNativeContext, numberOfChannels: number) => IBaseAudioContext;
