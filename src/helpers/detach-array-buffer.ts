export const detachArrayBuffer = (arrayBuffer: ArrayBuffer): void => {
    const { port1 } = new MessageChannel();

    port1.postMessage(arrayBuffer, [arrayBuffer]);
};
