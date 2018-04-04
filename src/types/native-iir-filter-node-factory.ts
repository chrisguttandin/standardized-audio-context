import { IIIRFilterOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeIIRFilterNode } from './native-iir-filter-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeIIRFilterNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options: IIIRFilterOptions
) => TNativeIIRFilterNode;
