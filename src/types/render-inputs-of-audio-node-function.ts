import { IAudioNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioNode } from './native-audio-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TRenderInputsOfAudioNodeFunction = <T extends IMinimalOfflineAudioContext>(
    audioNode: IAudioNode<T>,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioNode: TNativeAudioNode
) => Promise<void>; // tslint:disable-line:invalid-void
