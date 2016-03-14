import 'reflect-metadata';
import { Injector, provide } from 'angular2/core';
import { AudioBufferWrapper } from './wrapper/audio-buffer';
import { ChannelMergerNodeWrapper } from './wrapper/channel-merger-node';
import { EncodingErrorFactory } from './factories/encoding-error';
import { IIRFilterNodeFaker } from './fakers/iir-filter-node';
import { InvalidStateErrorFactory } from './factories/invalid-state-error';
import { NotSupportedErrorFactory } from './factories/not-supported-error';
import { PromiseSupportTester } from './tester/promise-support';
import { audioContextConstructor } from './audio-context-constructor';
import { isSupportedFlag } from './is-supported-flag';
import { modernizr } from './modernizr';
import { offlineAudioContextConstructor } from './offline-audio-context-constructor';
import { unpatchedAudioContextConstructor } from './unpatched-audio-context-constructor';
import { unpatchedOfflineAudioContextConstructor } from './unpatched-offline-audio-context-constructor';
import { window } from './window.js';

/* eslint-disable indent, new-cap */
var injector = Injector.resolveAndCreate([
        AudioBufferWrapper,
        ChannelMergerNodeWrapper,
        EncodingErrorFactory,
        InvalidStateErrorFactory,
        IIRFilterNodeFaker,
        NotSupportedErrorFactory,
        PromiseSupportTester,
        provide(audioContextConstructor, { useFactory: audioContextConstructor }),
        provide(isSupportedFlag, { useFactory: isSupportedFlag }),
        provide(modernizr, { useValue: modernizr }),
        provide(offlineAudioContextConstructor, { useFactory: offlineAudioContextConstructor }),
        provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
        provide(unpatchedOfflineAudioContextConstructor, { useFactory: unpatchedOfflineAudioContextConstructor }),
        provide(window, { useValue: window })
    ]);
/* eslint-enable indent, new-cap */

export const AudioContext = injector.get(audioContextConstructor);

export const isSupported = injector.get(isSupportedFlag);

export const OfflineAudioContext = injector.get(offlineAudioContextConstructor);
