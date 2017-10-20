import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core'; // tslint:disable-line:ordered-imports
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

const injector = ReflectiveInjector.resolveAndCreate([
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

export const isOfflineAudioContext = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext): boolean => {
    return context instanceof unpatchedOfflineAudioContextConstructor;
};
