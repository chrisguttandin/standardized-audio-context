import { ACTIVE_AUDIO_NODE_STORE, AUDIO_NODE_CONNECTIONS_STORE, AUDIO_NODE_STORE, CONTEXT_STORE, EVENT_LISTENERS } from '../../src/globals';

export const createScriptProcessor = (context, bufferSize, numberOfInputChannels, numberOfOutputChannels) => {
    const nativeContext = CONTEXT_STORE.get(context);
    const scriptProcessorNode = nativeContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
    const scriptProcessorNodeProxy = {
        connect(destination, ...args) {
            scriptProcessorNode.connect(AUDIO_NODE_STORE.get(destination), ...args);

            if (!ACTIVE_AUDIO_NODE_STORE.has(destination)) {
                const eventListeners = EVENT_LISTENERS.get(destination);

                ACTIVE_AUDIO_NODE_STORE.add(destination);

                eventListeners.forEach((eventListener) => eventListener(true));
            }

            const { activeInputs } = AUDIO_NODE_CONNECTIONS_STORE.get(destination);

            activeInputs[args[1] || 0].add([scriptProcessorNodeProxy, args[0] || 0, () => {}]);

            return destination;
        },
        get context() {
            return context;
        },
        disconnect(destination, ...args) {
            scriptProcessorNode.disconnect(AUDIO_NODE_STORE.get(destination), ...args);
        },
        set onaudioprocess(onaudioprocess) {
            scriptProcessorNode.onaudioprocess = onaudioprocess;
        }
    };

    ACTIVE_AUDIO_NODE_STORE.add(scriptProcessorNodeProxy);
    AUDIO_NODE_CONNECTIONS_STORE.set(scriptProcessorNodeProxy, {
        activeInputs: [new Set()],
        outputs: new Set(),
        passiveInputs: new WeakMap(),
        renderer: null
    });
    AUDIO_NODE_STORE.set(scriptProcessorNodeProxy, scriptProcessorNode);
    EVENT_LISTENERS.set(scriptProcessorNodeProxy, new Set());

    return scriptProcessorNodeProxy;
};
