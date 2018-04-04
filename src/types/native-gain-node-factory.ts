import { IGainOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeGainNode } from './native-gain-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeGainNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options?: Partial<IGainOptions>
) => TNativeGainNode;
