export const detachArrayBuffer = (arrayBuffer: ArrayBuffer): Promise<void> => {
    const { port1, port2 } = new MessageChannel();

    return new Promise((resolve) => {
        port2.onmessage = () => {
            port1.close();
            port2.close();

            resolve();
        };

        port1.postMessage(arrayBuffer, [arrayBuffer]);
    });
};
