import { IAudioDestinationNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TStartRenderingFunction = <T extends IMinimalOfflineAudioContext>(
    destination: IAudioDestinationNode<T>,
    nativeOfflineAudioContext: TNativeOfflineAudioContext
) => Promise<TNativeAudioBuffer>;
