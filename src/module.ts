import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { IS_SUPPORTED_PROMISE_PROVIDER, isSupportedPromise } from './providers/is-supported-promise';
import { MODERNIZR_PROVIDER } from './providers/modernizr';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from './providers/unpatched-audio-context-constructor';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';
import { AudioContextOptionsSupportTester } from './testers/audio-context-options';
import { CloseSupportTester } from './testers/close-support';
import { DecodeAudioDataTypeErrorSupportTester } from './testers/decode-audio-data-type-error-support';
import { MergingSupportTester } from './testers/merging-support';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioContextOptionsSupportTester,
    CloseSupportTester,
    DecodeAudioDataTypeErrorSupportTester,
    IS_SUPPORTED_PROMISE_PROVIDER,
    MODERNIZR_PROVIDER,
    MergingSupportTester,
    UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

export * from './interfaces';
export * from './types';

export { AudioContext } from './audio-contexts/audio-context';

export { OfflineAudioContext } from './audio-contexts/offline-audio-context';

export { decodeAudioData } from './decode-audio-data';

export const isSupported: Promise<boolean> = injector.get(isSupportedPromise);
