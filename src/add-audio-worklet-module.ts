import { Injector } from '@angular/core';
import { ABORT_ERROR_FACTORY_PROVIDER, AbortErrorFactory } from './factories/abort-error';
import { NOT_SUPPORTED_ERROR_FACTORY_PROVIDER, NotSupportedErrorFactory } from './factories/not-supported-error';
import { NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from './globals';
import { getNativeContext } from './helpers/get-native-context';
import { isConstructible } from './helpers/is-constructible';
import { IAudioWorkletProcessorConstructor, IMinimalBaseAudioContext, IWorkletOptions } from './interfaces';
import { TNativeAudioWorklet } from './types';

const injector = Injector.create({
    providers: [
        ABORT_ERROR_FACTORY_PROVIDER,
        NOT_SUPPORTED_ERROR_FACTORY_PROVIDER
    ]
});

const abortErrorFactory = injector.get(AbortErrorFactory);
const notSupportedErrorFactory = injector.get(NotSupportedErrorFactory);

const verifyParameterDescriptors = (parameterDescriptors: IAudioWorkletProcessorConstructor['parameterDescriptors']) => {
    if (!Array.isArray(parameterDescriptors)) {
        throw new TypeError('The parameterDescriptors property of given value for processorCtor is not an array.');
    }
};

const verifyProcessorCtor = <T extends IAudioWorkletProcessorConstructor> (processorCtor: T) => {
    if (!isConstructible(processorCtor)) {
        throw new TypeError('The given value for processorCtor should be a constructor.');
    }

    if (processorCtor.prototype === null || typeof processorCtor.prototype !== 'object') {
        throw new TypeError('The given value for processorCtor should have a prototype.');
    }

    if (typeof processorCtor.prototype.process !== 'function') {
        throw new TypeError('The given value for processorCtor should have a callable process() function.');
    }
};

const ongoingRequests: WeakMap<IMinimalBaseAudioContext, Map<string, Promise<void>>> = new WeakMap();
const resolvedRequests: WeakMap<IMinimalBaseAudioContext, Set<string>> = new WeakMap();

export const addAudioWorkletModule = (
    context: IMinimalBaseAudioContext,
    moduleURL: string,
    options: IWorkletOptions = { credentials: 'omit' }
): Promise<void> => {
    const nativeContext = getNativeContext(context);

    // Bug #59: Only Chrome Canary does implement the audioWorklet property.
    // @todo Define the native interface as part of the native AudioContext.
    if ((<any> nativeContext).audioWorklet !== undefined) {
        return (<TNativeAudioWorklet> (<any> nativeContext).audioWorklet).addModule(moduleURL, options);
    } else {
        const resolvedRequestsOfContext = resolvedRequests.get(context);

        if (resolvedRequestsOfContext !== undefined && resolvedRequestsOfContext.has(moduleURL)) {
            return Promise.resolve();
        }

        const ongoingRequestsOfContext = ongoingRequests.get(context);

        if (ongoingRequestsOfContext !== undefined) {
            const promiseOfOngoingRequest = ongoingRequestsOfContext.get(moduleURL);

            if (promiseOfOngoingRequest !== undefined) {
                return promiseOfOngoingRequest;
            }
        }

        const promise = fetch(moduleURL)
            .then((response) => {
                if (response.ok) {
                    return response.text();
                }

                throw abortErrorFactory.create();
            })
            .then((source) => {
                const fn = new Function(
                    'AudioWorkletProcessor',
                    'currentTime',
                    'global',
                    'registerProcessor',
                    'sampleRate',
                    'self',
                    'window',
                    source
                );

                const globalScope = Object.create(null, {
                    currentTime: {
                        get () {
                            return nativeContext.currentTime;
                        }
                    },
                    sampleRate: {
                        get () {
                            return nativeContext.sampleRate;
                        }
                    }
                });

                // @todo Evaluating the given source code is a possible security problem.
                fn(
                    class AudioWorkletProcessor { },
                    globalScope.currentTime,
                    undefined,
                    function <T extends IAudioWorkletProcessorConstructor> (name: string, processorCtor: T) {
                        if (name.trim() === '') {
                            throw notSupportedErrorFactory.create();
                        }

                        const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);

                        if (nodeNameToProcessorDefinitionMap !== undefined) {
                            if (nodeNameToProcessorDefinitionMap.has(name)) {
                                throw notSupportedErrorFactory.create();
                            }

                            verifyProcessorCtor(processorCtor);
                            verifyParameterDescriptors(processorCtor.parameterDescriptors);

                            nodeNameToProcessorDefinitionMap.set(name, processorCtor);
                        } else {
                            verifyProcessorCtor(processorCtor);
                            verifyParameterDescriptors(processorCtor.parameterDescriptors);

                            NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.set(nativeContext, new Map([ [ name, processorCtor ] ]));
                        }
                    },
                    globalScope.sampleRate,
                    undefined,
                    undefined
                );
            })
            .catch((err) => {
                if (err.name === 'SyntaxError') {
                    throw abortErrorFactory.create();
                }

                throw err;
            });

        if (ongoingRequestsOfContext === undefined) {
             ongoingRequests.set(context, new Map([ [ moduleURL, promise ] ]));
        } else {
            ongoingRequestsOfContext.set(moduleURL, promise);
        }

        promise
            .then(() => {
                const rslvdRqstsFCntxt = resolvedRequests.get(context);

                if (rslvdRqstsFCntxt === undefined) {
                    resolvedRequests.set(context, new Set([ moduleURL ]));
                } else {
                    rslvdRqstsFCntxt.add(moduleURL);
                }
            })
            .catch(() => { }) // tslint:disable-line:no-empty
            // @todo Use finally when it becomes available in all supported browsers.
            .then(() => {
                const ngngRqstsFCntxt = ongoingRequests.get(context);

                if (ngngRqstsFCntxt !== undefined) {
                    ngngRqstsFCntxt.delete(moduleURL);
                }
            });

        return promise;
    }
};
