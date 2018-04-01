import { Injector } from '@angular/core';
import browsernizr from './browsernizr';
import { createTestAudioContextCloseMethodSupport } from './factories/audio-context-close-method';
import {
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport
} from './factories/audio-context-decode-audio-data-method-type-error';
import { createTestAudioContextOptionsSupport } from './factories/audio-context-options';
import { createTestChannelMergerNodeSupport } from './factories/channel-merger-node';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import {
    UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedAudioContextConstructor
} from './providers/unpatched-audio-context-constructor';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor
} from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';

const injector = Injector.create({
    providers: [
        UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const nptchdDCntxtCnstrctr = injector.get(unpatchedAudioContextConstructor);
const nptchdFFlnDCntxtCnstrctr = injector.get(unpatchedOfflineAudioContextConstructor);

export * from './interfaces';
export * from './types';

export { AudioContext } from './audio-contexts/audio-context';

export { OfflineAudioContext } from './audio-contexts/offline-audio-context';

export { addAudioWorkletModule } from './add-audio-worklet-module';

export { decodeAudioData } from './decode-audio-data';

export const isSupported = () => createIsSupportedPromise(
    browsernizr,
    createTestAudioContextCloseMethodSupport(nptchdDCntxtCnstrctr),
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport(nptchdFFlnDCntxtCnstrctr),
    createTestAudioContextOptionsSupport(nptchdDCntxtCnstrctr),
    createTestChannelMergerNodeSupport(nptchdDCntxtCnstrctr)
);
