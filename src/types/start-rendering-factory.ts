import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';
import { TStartRenderingFunction } from './start-rendering-function';

export type TStartRenderingFactory = (
    renderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFunction
) => TStartRenderingFunction;
