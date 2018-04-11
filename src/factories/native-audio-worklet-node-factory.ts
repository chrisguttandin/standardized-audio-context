import { testClonabilityOfAudioWorkletNodeOptions } from '../helpers/test-clonability-of-audio-worklet-node-options';
import { TNativeAudioWorkletNodeFactoryFactory } from '../types';

export const createNativeAudioWorkletNodeFactory: TNativeAudioWorkletNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioWorkletNodeFaker,
    createNotSupportedError
) => {
    return (nativeContext, nativeAudioWorkletNodeConstructor, name, processorDefinition, options) => {
        if (nativeAudioWorkletNodeConstructor !== null) {
            try {
                // Bug #86: Chrome Canary does not invoke the process() function if the corresponding AudioWorkletNode has no output.
                const nativeNode = (options.numberOfInputs !== 0 && options.numberOfOutputs === 0) ?
                    new nativeAudioWorkletNodeConstructor(nativeContext, name, {
                        ...options,
                        numberOfOutputs: 1,
                        outputChannelCount: [ 1 ],
                        parameterData: { ...options.parameterData, hasNoOutput: 1 }
                    }) :
                    new nativeAudioWorkletNodeConstructor(nativeContext, name, options);

                if (options.numberOfOutputs === 0) {
                    nativeNode.connect(nativeContext.destination);

                    Object.defineProperty(nativeNode, 'numberOfOutputs', {
                        get: () => 0
                    });
                }

                /*
                 * Bug #61: Overwriting the property accessors is necessary as long as some browsers have no native implementation to
                 * achieve a consistent behavior.
                 */
                Object.defineProperties(nativeNode, {
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
                    }
                });

                return nativeNode;
            } catch (err) {
                // Bug #60: Chrome Canary throws an InvalidStateError instead of a NotSupportedError.
                if (err.code === 11 && nativeContext.state !== 'closed') {
                    throw createNotSupportedError();
                }

                throw err;
            }
        }

        // Bug #61: Only Chrome Canary has an implementation of the AudioWorkletNode yet.
        if (processorDefinition === undefined) {
            throw createNotSupportedError();
        }

        testClonabilityOfAudioWorkletNodeOptions(options);

        return createNativeAudioWorkletNodeFaker(nativeContext, processorDefinition, options);
    };
};
