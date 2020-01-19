import { NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS } from '../globals';
import { isConstructible } from '../helpers/is-constructible';
import { splitImportStatements } from '../helpers/split-import-statements';
import { IAudioWorkletProcessorConstructor } from '../interfaces';
import { TAddAudioWorkletModuleFactory, TEvaluateAudioWorkletGlobalScopeFunction } from '../types';

const verifyParameterDescriptors = (parameterDescriptors: IAudioWorkletProcessorConstructor['parameterDescriptors']) => {
    if (parameterDescriptors !== undefined && !Array.isArray(parameterDescriptors)) {
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
};

export const createAddAudioWorkletModule: TAddAudioWorkletModuleFactory = (
    createAbortError,
    createNotSupportedError,
    evaluateSource,
    exposeCurrentFrameAndCurrentTime,
    fetchSource,
    getBackupNativeContext,
    getNativeContext,
    ongoingRequests,
    resolvedRequests,
    window
) => {
    return (context, moduleURL, options = { credentials: 'omit' }) => {
        const nativeContext = getNativeContext(context);
        const absoluteUrl = (new URL(moduleURL, window.location.href)).toString();

        // Bug #59: Only Chrome & Opera do implement the audioWorklet property.
        if (nativeContext.audioWorklet !== undefined) {
            return fetchSource(moduleURL)
                .then((source) => {
                    const [ importStatements, sourceWithoutImportStatements ] = splitImportStatements(source, absoluteUrl);
                    /*
                     * Bug #86: Chrome and Opera do not invoke the process() function if the corresponding AudioWorkletNode has no output.
                     *
                     * This is the unminified version of the code used below:
                     *
                     * ```js
                     * `${ importStatements };
                     * ((registerProcessor) => {${ sourceWithoutImportStatements }
                     * })((name, processorCtor) => registerProcessor(name, class extends processorCtor {
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
                     * }))`
                     * ```
                     */
                    const wrappedSource = `${ importStatements };(registerProcessor=>{${ sourceWithoutImportStatements }
})((n,p)=>registerProcessor(n,class extends p{constructor(o){const{hasNoOutput,...q}=o.parameterData;if(hasNoOutput===1){super({...o,numberOfOutputs:0,outputChannelCount:[],parameterData:q});this._h=true}else{super(o);this._h=false}}process(i,o,p){return super.process(i,(this._h)?[]:o,p)}}))`; // tslint:disable-line:max-line-length
                    const blob = new Blob([ wrappedSource ], { type: 'application/javascript; charset=utf-8' });
                    const url = URL.createObjectURL(blob);

                    const backupNativeContext = getBackupNativeContext(nativeContext);
                    const nativeContextOrBackupNativeContext = (backupNativeContext !== null) ? backupNativeContext : nativeContext;

                    return nativeContextOrBackupNativeContext.audioWorklet
                        .addModule(url, options)
                        .then(() => URL.revokeObjectURL(url))
                        // @todo This could be written more elegantly when Promise.finally() becomes avalaible.
                        .catch((err) => {
                            URL.revokeObjectURL(url);

                            throw err; // tslint:disable-line:rxjs-throw-error
                        });
                });
        }

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

        const promise = fetchSource(moduleURL)
            .then((source) => {
                const [ importStatements, sourceWithoutImportStatements ] = splitImportStatements(source, absoluteUrl);

                /*
                 * This is the unminified version of the code used below:
                 *
                 * ```js
                 * ${ importStatements };
                 * ((a, b) => {
                 *     (a[b] = a[b] || [ ]).push(
                 *         (AudioWorkletProcessor, global, registerProcessor, sampleRate, self, window) => {
                 *             ${ sourceWithoutImportStatements }
                 *         }
                 *     );
                 * })(window, '_AWGS');
                 * ```
                 */
                // tslint:disable-next-line:max-line-length
                const wrappedSource = `${ importStatements };((a,b)=>{(a[b]=a[b]||[]).push((AudioWorkletProcessor,global,registerProcessor,sampleRate,self,window)=>{${ sourceWithoutImportStatements }
})})(window,'_AWGS')`;

                // @todo Evaluating the given source code is a possible security problem.
                return evaluateSource(wrappedSource);
            })
            .then(() => {
                const evaluateAudioWorkletGlobalScope = (<TEvaluateAudioWorkletGlobalScopeFunction[]> (<any> window)._AWGS).pop();

                if (evaluateAudioWorkletGlobalScope === undefined) {
                    throw new SyntaxError();
                }

                exposeCurrentFrameAndCurrentTime(
                    nativeContext.currentTime,
                    nativeContext.sampleRate,
                    () => evaluateAudioWorkletGlobalScope(
                        class AudioWorkletProcessor { },
                        undefined,
                        (name, processorCtor) => {
                            if (name.trim() === '') {
                                throw createNotSupportedError();
                            }

                            const nodeNameToProcessorConstructorMap = NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS.get(nativeContext);

                            if (nodeNameToProcessorConstructorMap !== undefined) {
                                if (nodeNameToProcessorConstructorMap.has(name)) {
                                    throw createNotSupportedError();
                                }

                                verifyProcessorCtor(processorCtor);
                                verifyParameterDescriptors(processorCtor.parameterDescriptors);

                                nodeNameToProcessorConstructorMap.set(name, processorCtor);
                            } else {
                                verifyProcessorCtor(processorCtor);
                                verifyParameterDescriptors(processorCtor.parameterDescriptors);

                                NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS.set(nativeContext, new Map([ [ name, processorCtor ] ]));
                            }
                        },
                        nativeContext.sampleRate,
                        undefined,
                        undefined
                    )
                );
            })
            .catch((err) => {
                if (err.name === 'SyntaxError') {
                    throw createAbortError();
                }

                throw err; // tslint:disable-line:rxjs-throw-error
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
    };
};
