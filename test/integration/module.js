const EXPORTS = [
    ['AnalyserNode', 'function'],
    ['AudioBuffer', 'function'],
    ['AudioBufferSourceNode', 'function'],
    ['AudioContext', 'function'],
    ['AudioWorkletNode', typeof window === 'undefined' ? 'undefined' : 'function'],
    ['BiquadFilterNode', 'function'],
    ['ChannelMergerNode', 'function'],
    ['ChannelSplitterNode', 'function'],
    ['ConstantSourceNode', 'function'],
    ['ConvolverNode', 'function'],
    ['DelayNode', 'function'],
    ['DynamicsCompressorNode', 'function'],
    ['GainNode', 'function'],
    ['IIRFilterNode', 'function'],
    ['MediaElementAudioSourceNode', 'function'],
    ['MediaStreamAudioDestinationNode', 'function'],
    ['MediaStreamAudioSourceNode', 'function'],
    ['MediaStreamTrackAudioSourceNode', 'function'],
    ['MinimalAudioContext', 'function'],
    ['MinimalOfflineAudioContext', 'function'],
    ['OfflineAudioContext', 'function'],
    ['OscillatorNode', 'function'],
    ['PannerNode', 'function'],
    ['PeriodicWave', 'function'],
    ['StereoPannerNode', 'function'],
    ['WaveShaperNode', 'function'],
    ['addAudioWorkletModule', typeof window === 'undefined' ? 'undefined' : 'function'],
    ['decodeAudioData', 'function'],
    ['isAnyAudioContext', 'function'],
    ['isAnyAudioNode', 'function'],
    ['isAnyAudioParam', 'function'],
    ['isAnyOfflineAudioContext', 'function'],
    ['isSupported', 'function']
];

describe('module', () => {
    for (const [name, type] of EXPORTS) {
        it(`should export the ${name} ${type}`, async () => {
            const { [name]: namedExport } = await import('../../src/module');

            if (type === 'undefined') {
                expect(namedExport).to.be.undefined;
            } else {
                expect(namedExport).to.be.a(type);
            }
        });
    }

    it('should only export known exports', async () => {
        expect(Object.keys(await import('../../src/module'))).to.deep.equal(EXPORTS.map(([name]) => name));
    });
});
