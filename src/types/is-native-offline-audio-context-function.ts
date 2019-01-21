import { TAnyContext } from './any-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TIsNativeOfflineAudioContextFunction = (anyContext: TAnyContext) => anyContext is TNativeOfflineAudioContext;
