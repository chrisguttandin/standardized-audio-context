import { IConstantSourceOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeConstantSourceNode } from './native-constant-source-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeConstantSourceNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options: IConstantSourceOptions
) => TNativeConstantSourceNode;
