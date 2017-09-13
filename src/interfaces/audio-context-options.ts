import { TAudioContextLatencyCategory } from '../types';

export interface IAudioContextOptions {

    latencyHint?: number | TAudioContextLatencyCategory;

    // @todo sampleRate: number;

}
