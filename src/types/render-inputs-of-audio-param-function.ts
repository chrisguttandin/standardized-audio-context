import { IAudioNode, IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam } from './native-audio-param';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TRenderInputsOfAudioParamFunction = <T extends IMinimalOfflineAudioContext>(
    audioParam: IAudioParam,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    nativeAudioParam: TNativeAudioParam,
    trace: readonly IAudioNode<T>[]
) => Promise<void>; // tslint:disable-line:invalid-void
