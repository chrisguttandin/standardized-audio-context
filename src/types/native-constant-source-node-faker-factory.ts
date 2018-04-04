import { IConstantSourceOptions, INativeConstantSourceNodeFaker } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeConstantSourceNodeFakerFactory = (
    nativeAudioContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options: Partial<IConstantSourceOptions>
) => INativeConstantSourceNodeFaker;
