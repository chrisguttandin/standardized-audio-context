import { Injector } from '@angular/core';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

const injector = Injector.create([
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

export const isOfflineAudioContext = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext): boolean => {
    if (unpatchedOfflineAudioContextConstructor === null) {
        throw new Error(); // @todo
    }

    return context instanceof unpatchedOfflineAudioContextConstructor;
};
