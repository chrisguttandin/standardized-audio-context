import { ACTIVE_AUDIO_NODE_STORE, AUDIO_GRAPHS, AUDIO_NODE_STORE, CONTEXT_STORE, EVENT_LISTENERS } from '../../src/globals';

export const createScriptProcessor = (context, bufferSize, numberOfInputChannels, numberOfOutputChannels) => {
    const nativeContext = CONTEXT_STORE.get(context);
    const scriptProcessorNode = nativeContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
    const scriptProcessorNodeProxy = {
        connect (destination, ...args) {
            scriptProcessorNode.connect(AUDIO_NODE_STORE.get(destination), ...args);

            if (!ACTIVE_AUDIO_NODE_STORE.has(destination)) {
                const eventListeners = EVENT_LISTENERS.get(destination);

                ACTIVE_AUDIO_NODE_STORE.add(destination);

                eventListeners.forEach((eventListener) => eventListener('active'));
            }

            const audioGraph = AUDIO_GRAPHS.get(context);
            const { activeInputs } = audioGraph.nodes.get(destination);

            activeInputs[ args[1] || 0 ].add([ destination, args[0] || 0 ]);

            return destination;
        },
        get context () {
            return context;
        },
        disconnect (destination, ...args) {
            scriptProcessorNode.disconnect(AUDIO_NODE_STORE.get(destination), ...args);
        },
        set onaudioprocess (onaudioprocess) {
            scriptProcessorNode.onaudioprocess = onaudioprocess;
        }
    };

    ACTIVE_AUDIO_NODE_STORE.add(scriptProcessorNodeProxy);
    AUDIO_NODE_STORE.set(scriptProcessorNodeProxy, scriptProcessorNode);
    EVENT_LISTENERS.set(scriptProcessorNodeProxy, new Set());

    const audioGraph = AUDIO_GRAPHS.get(context);

    if (audioGraph === undefined) {
        throw new Error('Missing the audio graph of the given context.');
    }

    const audioNodeConnections = { activeInputs: [ new Set() ], outputs: new Set(), passiveInputs: new WeakMap(), renderer: null };

    audioGraph.nodes.set(scriptProcessorNode, audioNodeConnections);
    audioGraph.nodes.set(scriptProcessorNodeProxy, audioNodeConnections);

    return scriptProcessorNodeProxy;
};
