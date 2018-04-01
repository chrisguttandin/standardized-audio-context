import { Injector } from '@angular/core';
import browsernizr from './browsernizr';
import { createAudioBufferConstructor } from './factories/audio-buffer-constructor';
import { createTestAudioContextCloseMethodSupport } from './factories/audio-context-close-method';
import { createAudioContextConstructor } from './factories/audio-context-constructor';
import {
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport
} from './factories/audio-context-decode-audio-data-method-type-error';
import { createTestAudioContextOptionsSupport } from './factories/audio-context-options';
import { createBaseAudioContextConstructor } from './factories/base-audio-context-constructor';
import { createTestChannelMergerNodeSupport } from './factories/channel-merger-node';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import { createMinimalAudioContextConstructor } from './factories/minimal-audio-context-constructor';
import { createMinimalBaseAudioContextConstructor } from './factories/minimal-base-audio-context-constructor';
import { createMinimalOfflineAudioContextConstructor } from './factories/minimal-offline-audio-context-constructor';
import { createOfflineAudioContextConstructor } from './factories/offline-audio-context-constructor';
import {
    IAudioBufferConstructor,
    IAudioContextConstructor,
    IMinimalAudioContextConstructor,
    IMinimalOfflineAudioContextConstructor,
    IOfflineAudioContextConstructor
} from './interfaces';
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

const audioBufferConstructor: IAudioBufferConstructor = createAudioBufferConstructor(nptchdFFlnDCntxtCnstrctr);

export { audioBufferConstructor as AudioBuffer };

const minimalBaseAudioContextConstructor = createMinimalBaseAudioContextConstructor();
const baseAudioContextConstructor = createBaseAudioContextConstructor(audioBufferConstructor, minimalBaseAudioContextConstructor);
const audioContextConstructor: IAudioContextConstructor = createAudioContextConstructor(baseAudioContextConstructor, nptchdDCntxtCnstrctr);

export { audioContextConstructor as AudioContext };

const minimalAudioContextConstructor: IMinimalAudioContextConstructor = createMinimalAudioContextConstructor(
    minimalBaseAudioContextConstructor,
    nptchdDCntxtCnstrctr
);

export { minimalAudioContextConstructor as MinimalAudioContext };

const minimalOfflineAudioContextConstructor: IMinimalOfflineAudioContextConstructor = createMinimalOfflineAudioContextConstructor(
    minimalBaseAudioContextConstructor,
    nptchdFFlnDCntxtCnstrctr
);

export { minimalOfflineAudioContextConstructor as MinimalOfflineAudioContext };

const offlineAudioContextConstructor: IOfflineAudioContextConstructor = createOfflineAudioContextConstructor(
    baseAudioContextConstructor,
    nptchdFFlnDCntxtCnstrctr
);

export { offlineAudioContextConstructor as OfflineAudioContext };

export { addAudioWorkletModule } from './add-audio-worklet-module';

export { decodeAudioData } from './decode-audio-data';

export const isSupported = () => createIsSupportedPromise(
    browsernizr,
    createTestAudioContextCloseMethodSupport(nptchdDCntxtCnstrctr),
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport(nptchdFFlnDCntxtCnstrctr),
    createTestAudioContextOptionsSupport(nptchdDCntxtCnstrctr),
    createTestChannelMergerNodeSupport(nptchdDCntxtCnstrctr)
);
