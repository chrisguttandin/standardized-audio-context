describe('DynamicsCompressorNode', () => {
    // bug #205

    it('should be actively processing all the time', async () => {
        const offlineAudioContext = new OfflineAudioContext({ length: 48294, sampleRate: 48000 });
        const buffer = new AudioBuffer({ length: 5, sampleRate: 48000 });
        const channelData = new Float32Array(Array.from({ length: 5 }, () => 1));

        buffer.copyToChannel(channelData, 0);

        const audioBufferSourceNode = new AudioBufferSourceNode(offlineAudioContext, { buffer });
        const dynamicsCompressorNode = new DynamicsCompressorNode(offlineAudioContext);

        audioBufferSourceNode.connect(dynamicsCompressorNode).connect(offlineAudioContext.destination);
        audioBufferSourceNode.start(1);

        const renderedBuffer = await offlineAudioContext.startRendering();

        renderedBuffer.copyFromChannel(channelData, 0, 48288);

        expect(Array.from(channelData)).to.deep.equal([
            0.9443932175636292, 0.9444449543952942, 0.9444966912269592, 0.944548487663269, 0.9446001648902893
        ]);
    });
});
