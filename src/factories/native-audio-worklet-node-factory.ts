import { testClonabilityOfAudioWorkletNodeOptions } from '../helpers/test-clonability-of-audio-worklet-node-options';
import { TNativeAudioWorkletNode, TNativeAudioWorkletNodeFactoryFactory } from '../types';

export const createNativeAudioWorkletNodeFactory: TNativeAudioWorkletNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioNode,
    createNativeAudioWorkletNodeFaker,
    createNotSupportedError,
    isNativeOfflineAudioContext
) => {
    return (nativeContext, baseLatency, nativeAudioWorkletNodeConstructor, name, processorConstructor, options) => {
        if (nativeAudioWorkletNodeConstructor !== null) {
            try {
                // Bug #86: Chrome & Opera do not invoke the process() function if the corresponding AudioWorkletNode has no output.
                const nativeAudioWorkletNode = createNativeAudioNode(nativeContext, (ntvCntxt) => {
                    return (isNativeOfflineAudioContext(ntvCntxt) && options.numberOfInputs !== 0 && options.numberOfOutputs === 0) ?
                        new nativeAudioWorkletNodeConstructor(ntvCntxt, name, {
                            ...options,
                            numberOfOutputs: 1,
                            outputChannelCount: [ 1 ],
                            parameterData: { ...options.parameterData, hasNoOutput: 1 }
                        }) :
                        new nativeAudioWorkletNodeConstructor(ntvCntxt, name, options);
                });
                const patchedEventListeners: Map<EventListenerOrEventListenerObject, NonNullable<TNativeAudioWorkletNode['onprocessorerror']>> = new Map(); // tslint:disable-line:max-line-length

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
                    // Bug #156: Chrome & Opera do not yet fire an ErrorEvent.
                    onprocessorerror: {
                        get: () => onprocessorerror,
                        set: (value) => {
                            if (typeof onprocessorerror === 'function') {
                                nativeAudioWorkletNode.removeEventListener('processorerror', onprocessorerror);
                            }

                            onprocessorerror = (typeof value === 'function') ? value : null;

                            if (typeof onprocessorerror === 'function') {
                                nativeAudioWorkletNode.addEventListener('processorerror', onprocessorerror);
                            }
                        }
                    }
                });

                nativeAudioWorkletNode.addEventListener = ((addEventListener) => {
                    return (...args: [ string, EventListenerOrEventListenerObject, (boolean | AddEventListenerOptions)? ]): void => {
                        if (args[0] === 'processorerror') {
                            const unpatchedEventListener = (typeof args[1] === 'function')
                                ? args[1]
                                : (typeof args[1] === 'object' && args[1] !== null && typeof args[1].handleEvent === 'function')
                                    ? args[1].handleEvent
                                    : null;

                            if (unpatchedEventListener !== null) {
                                const patchedEventListener = patchedEventListeners.get(args[1]);

                                if (patchedEventListener !== undefined) {
                                    args[1] = patchedEventListener;
                                } else {
                                    args[1] = (event: Event) => {
                                        unpatchedEventListener(new ErrorEvent(args[0], { ...event, error: new Error(/* @todo */) }));
                                    };

                                    patchedEventListeners.set(unpatchedEventListener, args[1]);
                                }
                            }
                        }

                        return addEventListener.call(nativeAudioWorkletNode, args[0], args[1], args[2]);
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

                        return removeEventListener.call(nativeAudioWorkletNode, args[0], args[1], args[2]);
                    };
                })(nativeAudioWorkletNode.removeEventListener);

                return nativeAudioWorkletNode;
            } catch (err) {
                // Bug #60: Chrome & Opera throw an InvalidStateError instead of a NotSupportedError.
                if (err.code === 11) {
                    throw createNotSupportedError();
                }

                throw err; // tslint:disable-line:rxjs-throw-error
            }
        }

        // Bug #61: Only Chrome & Opera have an implementation of the AudioWorkletNode yet.
        if (processorConstructor === undefined) {
            throw createNotSupportedError();
        }

        testClonabilityOfAudioWorkletNodeOptions(options);

        return createNativeAudioWorkletNodeFaker(nativeContext, baseLatency, processorConstructor, options);
    };
};
