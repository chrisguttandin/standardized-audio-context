export class StopStoppedSupportTester {

    test (audioContext) { // eslint-disable-line class-methods-use-this
        var audioBuffer = audioContext.createBuffer(1, 1, 44100),
            audioBufferSourceNode = audioContext.createBufferSource();

        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.start();
        audioBufferSourceNode.stop();

        try {
            audioBufferSourceNode.stop();

            return true;
        } catch (err) {
            return false;
        }
    }

}
