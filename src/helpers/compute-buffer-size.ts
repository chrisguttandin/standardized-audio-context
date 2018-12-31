export const computeBufferSize = (baseLatency: number, sampleRate: number) => {
    return Math.max(512, Math.min(16384, Math.pow(2, Math.round(Math.log2(baseLatency * sampleRate)))));
};
