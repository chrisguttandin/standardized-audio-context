import { IWorkletOptions } from './interfaces';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from './types';

export const addAudioWorkletModule = (
    context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    moduleURL: string,
    options: IWorkletOptions = { credentials: 'omit' }
): Promise<void> => {
    // Bug #59: Only Chrome Canary does implement the audioWorklet property.
    if (context.hasOwnProperty('audioWorklet')) {
        // @todo Define the native interface.
        return (<any> context).audioWorklet.addModule(moduleURL, options);
    } else {
        return Promise.resolve();
    }
};
