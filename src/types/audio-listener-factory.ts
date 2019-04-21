import { IAudioListener, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeContext } from './native-context';

export type TAudioListenerFactory = <T extends IMinimalBaseAudioContext>(context: T, nativeContext: TNativeContext) => IAudioListener;
