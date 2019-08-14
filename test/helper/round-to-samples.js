export const roundToSamples = (time, sampleRate, samples = 0) => (new Float64Array([ (Math.round(time * sampleRate) + samples) / sampleRate ]))[0];
