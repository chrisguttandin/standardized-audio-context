import { describe, expect, it } from 'vitest';

describe('DynamicsCompressorNode', () => {
    // bug #206

    it('should have no tail time', async () => {
        const offlineAudioContext = new OfflineAudioContext({ length: 294, sampleRate: 48000 });
        const buffer = new AudioBuffer({ length: 5, sampleRate: 48000 });
        const channelData = new Float32Array(Array.from({ length: 5 }, () => 1));

        buffer.copyToChannel(channelData, 0);

        const audioBufferSourceNode = new AudioBufferSourceNode(offlineAudioContext, { buffer });
        const dynamicsCompressorNode = new DynamicsCompressorNode(offlineAudioContext);

        audioBufferSourceNode.connect(dynamicsCompressorNode).connect(offlineAudioContext.destination);
        audioBufferSourceNode.start(0);

        const renderedBuffer = await offlineAudioContext.startRendering();

        renderedBuffer.copyFromChannel(channelData, 0, 288);

        expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
    });
});
