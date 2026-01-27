describe('MediaStreamAudioSourceNode', () => {
    let mediaStreamAudioDestinationNode;

    afterEach(() => mediaStreamAudioDestinationNode.context.close());

    beforeEach(() => {
        mediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode(new AudioContext());
    });

    // bug #212

    it('should not allow using a stream with a different sampleRate', async () => {
        const audioContext = new AudioContext({ sampleRate: mediaStreamAudioDestinationNode.context.sampleRate === 44100 ? 48000 : 44100 });

        try {
            expect(() => new MediaStreamAudioSourceNode(audioContext, { mediaStream: mediaStreamAudioDestinationNode.stream }))
                .to.throw(DOMException)
                .to.include({ code: 9, name: 'NotSupportedError' });
        } finally {
            await audioContext.close();
        }
    });
});
