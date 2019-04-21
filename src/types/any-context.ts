import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeContext } from './native-context';

export type TAnyContext = IMinimalBaseAudioContext | TNativeContext;
