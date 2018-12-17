import { IAudioListener } from '../interfaces';
import { TContext } from './context';
import { TNativeContext } from './native-context';

export type TAudioListenerFactory = (context: TContext, nativeContext: TNativeContext) => IAudioListener;
