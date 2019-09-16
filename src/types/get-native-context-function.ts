import { IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TGetNativeContextFunction = <T extends IMinimalBaseAudioContext>(
    context: T
) => T extends IMinimalOfflineAudioContext ? TNativeOfflineAudioContext : TNativeAudioContext;
