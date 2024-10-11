import { IAudioWorkletNodeOptions } from '../interfaces';

export type TTestAudioWorkletNodeOptionsClonabilityFunction = (
    audioWorkletNodeOptions: Omit<IAudioWorkletNodeOptions, 'outputChannelCount'> &
        Partial<Pick<IAudioWorkletNodeOptions, 'outputChannelCount'>>
) => void;
