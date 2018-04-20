import { createAbortError } from './factories/abort-error';
import { createNotSupportedError } from './factories/not-supported-error';
import { NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from './globals';
import { getNativeContext } from './helpers/get-native-context';
import { isConstructible } from './helpers/is-constructible';
import { IAudioWorkletProcessorConstructor, IWorkletOptions } from './interfaces';
import { TContext, TNativeAudioWorklet } from './types';

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

const ongoingRequests: WeakMap<TContext, Map<string, Promise<void>>> = new WeakMap();
const resolvedRequests: WeakMap<TContext, Set<string>> = new WeakMap();

export const addAudioWorkletModule = (
    context: TContext,
    moduleURL: string,
    options: IWorkletOptions = { credentials: 'omit' }
): Promise<void> => {
    const nativeContext = getNativeContext(context);

    // Bug #59: Only Chrome Canary does implement the audioWorklet property.
    // @todo Define the native interface as part of the native AudioContext.
    if ((<any> nativeContext).audioWorklet !== undefined) {
        return fetch(moduleURL)
            .then((response) => {
                if (response.ok) {
                    return response.text();
                }

                throw createAbortError();
            })
            .then((source) => {
                /*
                 * Bug #86: Chrome Canary does not invoke the process() function if the corresponding AudioWorkletNode has no output.
                 *
                 * This is the unminified version of the code used below:
                 *
                 * ```js
                 * ((registerProcessor) => {${ source }})((name, processorCtor) => registerProcessor(name, class extends processorCtor {
                 *
                 *     constructor (options) {
                 *         const { hasNoOutput, ...otherParameterData } = options.parameterData;
                 *
                 *         if (hasNoOutput === 1) {
                 *             super({ ...options, numberOfOutputs: 0, outputChannelCount: [ ], parameterData: otherParameterData });
                 *
                 *             this._hasNoOutput = true;
                 *         } else {
                 *             super(options);
                 *
                 *             this._hasNoOutput = false;
                 *         }
                 *     }
                 *
                 *     process (inputs, outputs, parameters) {
                 *         return super.process(inputs, (this._hasNoOutput) ? [ ] : outputs, parameters);
                 *     }
                 *
                 * }))
                 * ```
                 */
                const wrappedSource = `(registerProcessor=>{${ source }})((n,p)=>registerProcessor(n,class extends p{constructor(o){const{hasNoOutput,...q}=o.parameterData;if(hasNoOutput===1){super({...o,numberOfOutputs:0,outputChannelCount:[],parameterData:q});this._h=true}else{super(o);this._h=false}}process(i,o,p){return super.process(i,(this._h)?[]:o,p)}}))`; // tslint:disable-line:max-line-length
                const blob = new Blob([ wrappedSource ], { type: 'application/javascript; charset=utf-8' });
                const url = URL.createObjectURL(blob);

                return (<TNativeAudioWorklet> (<any> nativeContext).audioWorklet).addModule(url, options);
            });
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

                throw createAbortError();
            })
            .then((source) => {
                const fn = new Function(
                    'AudioWorkletProcessor',
                    'currentFrame',
                    'currentTime',
                    'global',
                    'registerProcessor',
                    'sampleRate',
                    'self',
                    'window',
                    source
                );

                const globalScope = Object.create(null, {
                    currentFrame: {
                        get () {
                            return nativeContext.currentTime * nativeContext.sampleRate;
                        }
                    },
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
                    globalScope.currentFrame,
                    globalScope.currentTime,
                    undefined,
                    function <T extends IAudioWorkletProcessorConstructor> (name: string, processorCtor: T) {
                        if (name.trim() === '') {
                            throw createNotSupportedError();
                        }

                        const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);

                        if (nodeNameToProcessorDefinitionMap !== undefined) {
                            if (nodeNameToProcessorDefinitionMap.has(name)) {
                                throw createNotSupportedError();
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
                    throw createAbortError();
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
