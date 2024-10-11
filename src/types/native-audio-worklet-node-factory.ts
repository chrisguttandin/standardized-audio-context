import { IAudioWorkletNodeOptions } from '../interfaces';
import { TNativeAudioWorkletNode } from './native-audio-worklet-node';
import { TNativeAudioWorkletNodeConstructor } from './native-audio-worklet-node-constructor';
import { TNativeContext } from './native-context';

export type TNativeAudioWorkletNodeFactory = (
    nativeContext: TNativeContext,
    nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor,
    name: string,
    options: Omit<IAudioWorkletNodeOptions, 'outputChannelCount'> & Partial<Pick<IAudioWorkletNodeOptions, 'outputChannelCount'>>
) => TNativeAudioWorkletNode;
