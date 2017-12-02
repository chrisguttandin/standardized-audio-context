import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { Injector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { IS_SUPPORTED_PROMISE_PROVIDER, isSupportedPromise } from './providers/is-supported-promise';
import { MODERNIZR_PROVIDER } from './providers/modernizr';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from './providers/unpatched-audio-context-constructor';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';
import { AUDIO_CONTEXT_OPTIONS_SUPPORT_TESTER_PROVIDER } from './support-testers/audio-context-options';
import { CLOSE_SUPPORT_TESTER_PROVIDER } from './support-testers/close';
import { DECODE_AUDIO_DATA_TYPE_ERROR_SUPPORT_TESTER_PROVIDER } from './support-testers/decode-audio-data-type-error';
import { MERGE_SUPPORT_TESTER_PROVIDER } from './support-testers/merging';

const injector = Injector.create([
    AUDIO_CONTEXT_OPTIONS_SUPPORT_TESTER_PROVIDER,
    CLOSE_SUPPORT_TESTER_PROVIDER,
    DECODE_AUDIO_DATA_TYPE_ERROR_SUPPORT_TESTER_PROVIDER,
    IS_SUPPORTED_PROMISE_PROVIDER,
    MODERNIZR_PROVIDER,
    MERGE_SUPPORT_TESTER_PROVIDER,
    UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

export * from './interfaces';
export * from './types';

export { AudioContext } from './audio-contexts/audio-context';

export { OfflineAudioContext } from './audio-contexts/offline-audio-context';

export { decodeAudioData } from './decode-audio-data';

export const isSupported = injector.get(isSupportedPromise);
