import { IAudioNode, IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam } from './native-audio-param';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TRenderAutomationFunction = <T extends IMinimalOfflineAudioContext> (
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: TNativeAudioParam,
    trace: readonly IAudioNode<T>[]
) => Promise<void>; // tslint:disable-line:invalid-void
