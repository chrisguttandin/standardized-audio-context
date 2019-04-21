import { IMinimalBaseAudioContext, IWorkletOptions } from '../interfaces';

export type TAddAudioWorkletModuleFunction = (
    context: IMinimalBaseAudioContext,
    moduleURL: string,
    options?: IWorkletOptions
) => Promise<void>;
