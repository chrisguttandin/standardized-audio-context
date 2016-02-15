import 'reflect-metadata';
import { Injector, provide } from 'angular2/core';
import { audioContextConstructor } from './audio-context-constructor';
import { isSupportedFlag } from './is-supported-flag';
import { modernizr } from './modernizr';
import { unpatchedAudioContextConstructor } from './unpatched-audio-context-constructor';
import { window } from './window.js';

/* eslint-disable indent, new-cap */
var injector = Injector.resolveAndCreate([
        provide(audioContextConstructor, { useFactory: audioContextConstructor }),
        provide(isSupportedFlag, { useFactory: isSupportedFlag }),
        provide(modernizr, { useValue: modernizr }),
        provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
        provide(window, { useValue: window })
    ]);
/* eslint-enable indent, new-cap */

export const AudioContext = injector.get(audioContextConstructor);

export const isSupported = injector.get(isSupportedFlag);
