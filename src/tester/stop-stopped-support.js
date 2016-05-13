export class StopStoppedSupportTester {

    test (audioContext) {
        var audioBuffer = audioContext.createBuffer(1, 1, 44100),
            bufferSourceNode = audioContext.createBufferSource();

        bufferSourceNode.buffer = audioBuffer;
        bufferSourceNode.start();
        bufferSourceNode.stop();

        try {
            bufferSourceNode.stop();

            return true;
        } catch (err) {
            return false;
        }
    }

}
