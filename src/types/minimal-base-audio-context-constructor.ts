import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeContext } from './native-context';

export type TMinimalBaseAudioContextConstructor = new (
    nativeContext: TNativeContext,
    numberOfChannels: number
) => IMinimalBaseAudioContext;
