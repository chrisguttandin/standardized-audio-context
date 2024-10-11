import { TNativeAudioWorkletNodeConstructor } from '../types';
import type { createIsSecureContext } from './is-secure-context';

/*
 * Bug #61: Firefox up to version 75 had no AudioWorkletNode implementation.
 *
 * Bug #59: Firefox up to version 75 had no audioWorklet property implementation of an AudioContext.
 */
export const createTestAudioWorkletNodeConstructorSupport =
    (
        isSecureContext: ReturnType<typeof createIsSecureContext>,
        nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor
    ) =>
    () => (isSecureContext ? true : nativeAudioWorkletNodeConstructor !== null);
