import { IAudioDestinationNode } from '../interfaces';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TStartRenderingFunction = (
    destination: IAudioDestinationNode,
    nativeOfflineAudioContext: TNativeOfflineAudioContext
) => Promise<TNativeAudioBuffer>;
