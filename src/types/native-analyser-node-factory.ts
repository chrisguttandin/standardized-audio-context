import { IAnalyserOptions } from '../interfaces';
import { TNativeAnalyserNode } from './native-analyser-node';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeAnalyserNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options?: Partial<IAnalyserOptions>
) => TNativeAnalyserNode;
