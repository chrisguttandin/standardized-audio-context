import { IAnalyserNode } from './analyser-node';
import { IAnalyserOptions } from './analyser-options';
import { IAudioContext } from './audio-context';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IAnalyserNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IAnalyserOptions>
    ): IAnalyserNode;

}
