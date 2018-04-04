import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TIsNativeOfflineAudioContextFunction = (nativeContext: TNativeAudioContext | TNativeOfflineAudioContext) => boolean;
