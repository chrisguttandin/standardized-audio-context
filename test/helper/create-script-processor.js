import { AUDIO_GRAPHS, AUDIO_NODE_STORE, CONTEXT_STORE } from '../../src/globals';

export const createScriptProcessor = (context, bufferSize, numberOfInputChannels, numberOfOutputChannels) => {
    const nativeContext = CONTEXT_STORE.get(context);
    const scriptProcessorNode = nativeContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
    const scriptProcessorNodeProxy = new Proxy(scriptProcessorNode, {

        get (target, property) {
            if (property === 'connect' || property === 'disconnect') {
                return function (destination, ...args) {
                    target[property].call(target, AUDIO_NODE_STORE.get(destination), ...args);

                    if (property === 'connect') {
                        return destination;
                    }
                };
            }

            if (property === 'context') {
                return context;
            }

            return target[property];
        },

        set (target, property, value) {
            target[property] = value;

            return true;
        }

    });

    AUDIO_NODE_STORE.set(scriptProcessorNodeProxy, scriptProcessorNode);

    const audioGraph = AUDIO_GRAPHS.get(context);

    if (audioGraph === undefined) {
        throw new Error('Missing the audio graph of the given context.');
    }

    const audioNodeConnections = { inputs: [ new Set() ], outputs: new Set(), renderer: null };

    audioGraph.nodes.set(scriptProcessorNode, audioNodeConnections);
    audioGraph.nodes.set(scriptProcessorNodeProxy, audioNodeConnections);

    return scriptProcessorNodeProxy;
};
