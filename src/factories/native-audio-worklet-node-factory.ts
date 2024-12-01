import { TNativeAudioWorkletNode, TNativeAudioWorkletNodeFactoryFactory, TNativeAudioWorkletNodeOptions } from '../types';

export const createNativeAudioWorkletNodeFactory: TNativeAudioWorkletNodeFactoryFactory = (createNotSupportedError) => {
    return (nativeContext, nativeAudioWorkletNodeConstructor, name, options) => {
        if (nativeAudioWorkletNodeConstructor === null) {
            throw new Error('Missing the native AudioWorkletNode constructor.');
        }

        try {
            const nativeAudioWorkletNode = new nativeAudioWorkletNodeConstructor(
                nativeContext,
                name,
                <TNativeAudioWorkletNodeOptions>options
            );
            const patchedEventListeners: Map<
                EventListenerOrEventListenerObject,
                NonNullable<TNativeAudioWorkletNode['onprocessorerror']>
            > = new Map();

            let onprocessorerror: TNativeAudioWorkletNode['onprocessorerror'] = null;

            Object.defineProperties(nativeAudioWorkletNode, {
                // Bug #178: Chrome dispatches an event of type error.
                onprocessorerror: {
                    get: () => onprocessorerror,
                    set: (value) => {
                        if (typeof onprocessorerror === 'function') {
                            nativeAudioWorkletNode.removeEventListener('processorerror', onprocessorerror);
                        }

                        onprocessorerror = typeof value === 'function' ? value : null;

                        if (typeof onprocessorerror === 'function') {
                            nativeAudioWorkletNode.addEventListener('processorerror', onprocessorerror);
                        }
                    }
                }
            });

            nativeAudioWorkletNode.addEventListener = ((addEventListener) => {
                return (...args: Parameters<TNativeAudioWorkletNode['addEventListener']>) => {
                    if (args[0] === 'processorerror') {
                        const unpatchedEventListener =
                            typeof args[1] === 'function'
                                ? args[1]
                                : typeof args[1] === 'object' && args[1] !== null && typeof args[1].handleEvent === 'function'
                                  ? args[1].handleEvent
                                  : null;

                        if (unpatchedEventListener !== null) {
                            const patchedEventListener = patchedEventListeners.get(args[1]);

                            if (patchedEventListener !== undefined) {
                                args[1] = <typeof unpatchedEventListener>patchedEventListener;
                            } else {
                                args[1] = (event: Parameters<typeof unpatchedEventListener>[0]) => {
                                    // Bug #178: Chrome dispatches an event of type error.
                                    if (event instanceof ErrorEvent && event.error === null) {
                                        Object.defineProperties(event, {
                                            error: { value: undefined }
                                        });
                                    }

                                    if (event.type === 'error') {
                                        Object.defineProperties(event, {
                                            type: { value: 'processorerror' }
                                        });
                                    }

                                    unpatchedEventListener(event);
                                };

                                patchedEventListeners.set(unpatchedEventListener, args[1]);
                            }
                        }
                    }

                    // Bug #178: Chrome dispatches an event of type error.
                    addEventListener.call(nativeAudioWorkletNode, 'error', args[1], args[2]);

                    return addEventListener.call(nativeAudioWorkletNode, ...args);
                };
            })(nativeAudioWorkletNode.addEventListener);

            nativeAudioWorkletNode.removeEventListener = ((removeEventListener) => {
                return (...args: Parameters<TNativeAudioWorkletNode['removeEventListener']>) => {
                    if (args[0] === 'processorerror') {
                        const patchedEventListener = patchedEventListeners.get(args[1]);

                        if (patchedEventListener !== undefined) {
                            patchedEventListeners.delete(args[1]);

                            args[1] = <(typeof args)[1]>patchedEventListener;
                        }
                    }

                    // Bug #178: Chrome dispatches an event of type error.
                    removeEventListener.call(nativeAudioWorkletNode, 'error', args[1], args[2]);

                    return removeEventListener.call(nativeAudioWorkletNode, args[0], args[1], args[2]);
                };
            })(nativeAudioWorkletNode.removeEventListener);

            return nativeAudioWorkletNode;
        } catch (err) {
            // Bug #60: Chrome throws an InvalidStateError instead of a NotSupportedError.
            if (err.code === 11) {
                throw createNotSupportedError();
            }

            throw err;
        }
    };
};
