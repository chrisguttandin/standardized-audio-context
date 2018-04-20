import { TNativeContext } from './native-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TIsNativeOfflineAudioContextFunction = (nativeContext: TNativeContext) => nativeContext is TNativeOfflineAudioContext;
