import { OpaqueToken } from '@angular/core';

export const DetachedAudioBuffers = new OpaqueToken('DETACHED_AUDIO_BUFFERS'); // tslint:disable-line:variable-name

export const DETACHED_AUDIO_BUFFERS_PROVIDER = { provide: DetachedAudioBuffers, useValue: new WeakSet() };
