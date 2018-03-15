import { Injector } from '@angular/core';
import { ABORT_ERROR_FACTORY_PROVIDER, AbortErrorFactory } from './factories/abort-error';
import { NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS } from './globals';
import { getNativeContext } from './helpers/get-native-context';
import { IMinimalBaseAudioContext, IWorkletOptions } from './interfaces';
import { TNativeAudioWorklet } from './types';

const injector = Injector.create({
    providers: [
        ABORT_ERROR_FACTORY_PROVIDER
    ]
});

const abortErrorFactory = injector.get(AbortErrorFactory);

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
        // @todo Cache a previously loaded processor.
        return fetch(moduleURL)
            .then((response) => {
                if (response.ok) {
                    return response.text();
                }

                throw abortErrorFactory.create();
            })
            .then((source) => {
                const fn = new Function('AudioWorkletProcessor', 'registerProcessor', source);

                // @todo Evaluating the given source code is a possible security problem.
                fn(class AudioWorkletProcessor { }, function (name: string, processorCtor: () => void) {
                    const nodeNameToProcessorDefinitionMap = NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.get(nativeContext);

                    if (nodeNameToProcessorDefinitionMap !== undefined) {
                        nodeNameToProcessorDefinitionMap.set(name, processorCtor);
                    } else {
                        NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.set(nativeContext, new Map([ [ name, processorCtor ] ]));
                    }
                });
            })
            .catch((err) => {
                if (err.name === 'SyntaxError') {
                    throw abortErrorFactory.create();
                }

                throw err;
            });
    }
};
