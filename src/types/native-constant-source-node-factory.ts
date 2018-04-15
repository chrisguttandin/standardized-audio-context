import { IConstantSourceOptions, INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeConstantSourceNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options: IConstantSourceOptions
) => INativeConstantSourceNode;
