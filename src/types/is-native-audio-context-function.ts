import { TAnyContext } from './any-context';
import { TNativeAudioContext } from './native-audio-context';

export type TIsNativeAudioContextFunction = (anyContext: TAnyContext) => anyContext is TNativeAudioContext;
