import { TContext } from '../types';
import { TNativeContext } from './native-context';

export type TContextStore = WeakMap<TContext, TNativeContext>;
