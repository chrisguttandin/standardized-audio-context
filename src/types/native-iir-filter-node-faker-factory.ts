import { IIIRFilterOptions, INativeIIRFilterNodeFaker } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeIIRFilterNodeFakerFactory = (
    nativeAudioContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options: IIIRFilterOptions
) => INativeIIRFilterNodeFaker;
