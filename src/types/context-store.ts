import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeContext } from './native-context';

export type TContextStore = WeakMap<IMinimalBaseAudioContext, TNativeContext>;
