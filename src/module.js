'use strict';

import { provider as audioContextProvider } from './audio-context';
import { Injector } from 'di';
import { provider as isSupportedProvider } from './is-supported';

var injector = new Injector();

export const AudioContext = injector.get(audioContextProvider);

export const isSupported = injector.get(isSupportedProvider);
