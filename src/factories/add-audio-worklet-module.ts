import { splitImportStatements } from '../helpers/split-import-statements';
import { TAddAudioWorkletModuleFactory } from '../types';

export const createAddAudioWorkletModule: TAddAudioWorkletModuleFactory = (
    cacheTestResult,
    fetchSource,
    getNativeContext,
    getOrCreateBackupOfflineAudioContext,
    isNativeOfflineAudioContext,
    ongoingRequests,
    resolvedRequests,
    testAudioWorkletProcessorPostMessageSupport
) => {
    return (context, moduleURL, options = { credentials: 'omit' }) => {
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

        const nativeContext = getNativeContext(context);

        const promise = Promise.all([
            fetchSource(moduleURL),
            Promise.resolve(cacheTestResult(testAudioWorkletProcessorPostMessageSupport, testAudioWorkletProcessorPostMessageSupport))
        ]).then(([[source, absoluteUrl], isSupportingPostMessage]) => {
            const [importStatements, sourceWithoutImportStatements] = splitImportStatements(source, absoluteUrl);
            /*
             * Bug #179: Firefox does not allow to transfer any buffer which has been passed to the process() method as an argument.
             *
             * This is the unminified version of the code used below.
             *
             * ```js
             * class extends AudioWorkletProcessor {
             *
             *     __buffers = new WeakSet();
             *
             *     constructor () {
             *         super();
             *
             *         this.port.postMessage = ((postMessage) => {
             *             return (message, transferables) => {
             *                 const filteredTransferables = (transferables)
             *                     ? transferables.filter((transferable) => !this.__buffers.has(transferable))
             *                     : transferables;
             *
             *                 return postMessage.call(this.port, message, filteredTransferables);
             *              };
             *         })(this.port.postMessage);
             *     }
             * }
             * ```
             */
            const patchedAudioWorkletProcessor = isSupportingPostMessage
                ? 'AudioWorkletProcessor'
                : 'class extends AudioWorkletProcessor {__b=new WeakSet();constructor(){super();(p=>p.postMessage=(q=>(m,t)=>q.call(p,m,t?t.filter(u=>!this.__b.has(u)):t))(p.postMessage))(this.port)}}';
            /*
             * Bug #179: Firefox does not allow to transfer any buffer which has been passed to the process() method as an argument.
             *
             * This is the unminified version of the code used below:
             *
             * ```js
             * `${ importStatements };
             * ((AudioWorkletProcessor, registerProcessor) => {${ sourceWithoutImportStatements }
             * })(
             *     ${ patchedAudioWorkletProcessor },
             *     (name, processorCtor) => registerProcessor(name, class extends processorCtor {
             *
             *         __collectBuffers = (array) => {
             *             array.forEach((element) => this.__buffers.add(element.buffer));
             *         };
             *
             *         process (inputs, outputs, parameters) {
             *             inputs.forEach(this.__collectBuffers);
             *             outputs.forEach(this.__collectBuffers);
             *             this.__collectBuffers(Object.values(parameters));
             *
             *             return super.process(
             *                 inputs,
             *                 outputs,
             *                 parameters
             *             );
             *         }
             *
             *     })
             * );`
             * ```
             */
            const memberDefinition = isSupportingPostMessage ? '' : '__c = (a) => a.forEach(e=>this.__b.add(e.buffer));';
            const bufferRegistration = isSupportingPostMessage ? '' : 'i.forEach(this.__c);o.forEach(this.__c);this.__c(Object.values(p));';
            const wrappedSource = `${importStatements};((AudioWorkletProcessor,registerProcessor)=>{${sourceWithoutImportStatements}
})(${patchedAudioWorkletProcessor},(n,p)=>registerProcessor(n,class extends p{${memberDefinition}process(i,o,p){${bufferRegistration}return super.process(i,o,p)}}))`;
            const blob = new Blob([wrappedSource], { type: 'application/javascript; charset=utf-8' });
            const url = URL.createObjectURL(blob);

            return nativeContext.audioWorklet
                .addModule(url, options)
                .then(() => {
                    if (isNativeOfflineAudioContext(nativeContext)) {
                        return;
                    }

                    // Bug #186: Chrome does not allow to create an AudioWorkletNode on a closed AudioContext.
                    const backupOfflineAudioContext = getOrCreateBackupOfflineAudioContext(nativeContext);

                    return backupOfflineAudioContext.audioWorklet.addModule(url, options);
                })
                .finally(() => URL.revokeObjectURL(url));
        });

        if (ongoingRequestsOfContext === undefined) {
            ongoingRequests.set(context, new Map([[moduleURL, promise]]));
        } else {
            ongoingRequestsOfContext.set(moduleURL, promise);
        }

        promise
            .then(
                () => {
                    const updatedResolvedRequestsOfContext = resolvedRequests.get(context);

                    if (updatedResolvedRequestsOfContext === undefined) {
                        resolvedRequests.set(context, new Set([moduleURL]));
                    } else {
                        updatedResolvedRequestsOfContext.add(moduleURL);
                    }
                },
                () => {
                    // Ignore errors.
                }
            )
            .finally(() => {
                const updatedOngoingRequestsOfContext = ongoingRequests.get(context);

                if (updatedOngoingRequestsOfContext !== undefined) {
                    updatedOngoingRequestsOfContext.delete(moduleURL);
                }
            });

        return promise;
    };
};
