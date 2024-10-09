import { testClonabilityOfAudioWorkletNodeOptions } from '../helpers/test-clonability-of-audio-worklet-node-options';
import { TNativeAudioWorkletNode, TNativeAudioWorkletNodeFactoryFactory, TNativeAudioWorkletNodeOptions } from '../types';

export const createNativeAudioWorkletNodeFactory: TNativeAudioWorkletNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioWorkletNodeFaker,
    createNotSupportedError
) => {
    return (nativeContext, baseLatency, nativeAudioWorkletNodeConstructor, name, processorConstructor, options) => {
        if (nativeAudioWorkletNodeConstructor !== null) {
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
                    /*
                     * Bug #61: Overwriting the property accessors for channelCount and channelCountMode is necessary as long as some
                     * browsers have no native implementation to achieve a consistent behavior.
                     */
                    channelCount: {
                        get: () => options.channelCount,
                        set: () => {
                            throw createInvalidStateError();
                        }
                    },
                    channelCountMode: {
                        get: () => 'explicit',
                        set: () => {
                            throw createInvalidStateError();
                        }
                    },
                    // Bug #156: Chrome does not yet fire an ErrorEvent.
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
                    return (...args: [string, EventListenerOrEventListenerObject, (boolean | AddEventListenerOptions)?]): void => {
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
                                    args[1] = patchedEventListener;
                                } else {
                                    args[1] = (event: Event) => {
                                        // Bug #178: Chrome dispatches an event of type error.
                                        if (event.type === 'error') {
                                            Object.defineProperties(event, {
                                                type: { value: 'processorerror' }
                                            });

                                            unpatchedEventListener(event);
                                        } else {
                                            unpatchedEventListener(new ErrorEvent(args[0], { ...event }));
                                        }
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
                    return (...args: any[]): void => {
                        if (args[0] === 'processorerror') {
                            const patchedEventListener = patchedEventListeners.get(args[1]);

                            if (patchedEventListener !== undefined) {
                                patchedEventListeners.delete(args[1]);

                                args[1] = patchedEventListener;
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
        }

        // Bug #61: Only Chrome and Firefox have an implementation of the AudioWorkletNode yet.
        if (processorConstructor === undefined) {
            throw createNotSupportedError();
        }

        testClonabilityOfAudioWorkletNodeOptions(options);

        return createNativeAudioWorkletNodeFaker(nativeContext, baseLatency, processorConstructor, options);
    };
};
